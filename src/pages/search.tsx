// src/pages/search.tsx
import { useEffect, useMemo, useRef, useState } from "react"
import styled from "@emotion/styled"
import Link from "next/link"
import type { GetStaticProps, NextPage } from "next"
// ✅ default import works with esModuleInterop: true in your tsconfig
import MiniSearch from "minisearch"
// If your TS complains about default export, use this instead:
// import * as MiniSearchLib from "minisearch"
// const MiniSearch = (MiniSearchLib as any).default || (MiniSearchLib as any)

import { CONFIG, CATEGORIES } from "site.config"
import MetaConfig from "src/components/MetaConfig"
import { getPosts } from "src/apis"
import { filterPosts } from "src/libs/utils/notion"

type Doc = {
  id: string
  title: string
  slug: string
  summary: string
  date?: string
  tags: string[]
  category?: string
  child?: string
}

type Props = {
  docs: Doc[]
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const all = filterPosts(await getPosts())

  const docs: Doc[] = (all || []).map((p: any) => {
    const tags: string[] = Array.isArray(p?.tags)
      ? p.tags.map((t: any) => String(t).toLowerCase())
      : []

    const title = String(p?.title || "Untitled")
    const slug = String(p?.slug || "")
    const summary = String(p?.summary || p?.excerpt || p?.description || "").slice(0, 280)

    // derive category/child by matching against CATEGORIES slugs
    let category: string | undefined
    let child: string | undefined
    for (const cat of CATEGORIES) {
      if (tags.includes(cat.slug.toLowerCase())) category = cat.slug
      for (const ch of cat.children ?? []) {
        if (tags.includes(ch.slug.toLowerCase())) {
          child = ch.slug
          if (!category) category = cat.slug
        }
      }
    }

    return {
      id: String(p?.id || slug || title),
      title,
      slug,
      summary,
      date: p?.date || p?.createdTime || "",
      tags,
      category,
      child,
    }
  })

  return {
    props: { docs },
    revalidate: Number(CONFIG.revalidateTime) || 60,
  }
}

const SearchPage: NextPage<Props> = ({ docs }) => {
  const meta = {
    title: `Search — ${CONFIG.blog.title}`,
    description: "Find posts by title, summary, tags, or category.",
    type: "website",
    url: `${CONFIG.link}/search`,
  }

  // read initial ?q= from URL once on mount
  const [q, setQ] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (typeof window === "undefined") return
    const init = (new URL(window.location.href).searchParams.get("q") || "").trim()
    setQ(init)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // build minisearch once
  const mini = useMemo(() => {
    const ms = new MiniSearch<Doc>({
      fields: ["title", "summary", "tags", "category", "child"],
      storeFields: ["title", "slug", "summary", "date", "tags", "category", "child"],
      searchOptions: { fuzzy: 0.2, prefix: true },
    })
    ms.addAll(docs)
    return ms
  }, [docs])

  // results
  const results = useMemo(() => {
    const query = q.trim()
    if (!query) return []
    return mini.search(query)
  }, [mini, q])

  // update shareable URL without navigation
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const query = q.trim()
    if (!query) return
    const url = new URL(window.location.href)
    url.searchParams.set("q", query)
    window.history.replaceState({}, "", url.toString())
  }

  return (
    <>
      <MetaConfig {...meta} />
      <Container>
        <Header>
          <Title>Search</Title>
          <p className="muted">
            Find posts by <em>title</em>, <em>summary</em>, <em>tags</em>, or <em>category</em>.
          </p>

          <Form role="search" onSubmit={onSubmit}>
            <InputWrap>
              <Icon aria-hidden viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </Icon>
              <input
                ref={inputRef}
                type="search"
                placeholder="Search posts, tags…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label="Search posts"
              />
              <kbd title="Press Enter to persist query">⏎</kbd>
            </InputWrap>
          </Form>
        </Header>

        <Main>
          {!q.trim() ? (
            <Empty>
              Type to search. Try <code>thoughts</code>, <code>ideas</code>, <code>reviews</code>…
            </Empty>
          ) : results.length === 0 ? (
            <Empty>
              No results for <strong>{q}</strong>.
            </Empty>
          ) : (
            <List>
              {results.map((r: any) => {
                const doc: Doc = r as any
                return (
                  <Item key={doc.id} href={`/${doc.slug}`}>
                    <h3>{doc.title}</h3>
                    {doc.summary && <p className="excerpt">{doc.summary}</p>}
                    <Meta>
                      {doc.date && <span>🗓️ {doc.date}</span>}
                      {!!doc.category && <Badge href={`/category/${doc.category}`}>#{doc.category}</Badge>}
                      {!!doc.child && (
                        <Badge href={`/category/${doc.category}/${doc.child}`}>#{doc.child}</Badge>
                      )}
                      <Tags>
                        {(doc.tags || []).slice(0, 3).map((t) => (
                          <small key={t}>#{t}</small>
                        ))}
                      </Tags>
                    </Meta>
                  </Item>
                )
              })}
            </List>
          )}
        </Main>
      </Container>
    </>
  )
}

export default SearchPage

/* ---------------- styled ---------------- */

const Container = styled.main`
  max-width: 1120px;
  margin: 0 auto;
  padding: 2rem 1rem;
`

const Header = styled.header`
  margin-bottom: 1rem;
  .muted { color: ${({ theme }) => theme.colors.gray11}; margin: .35rem 0 0 0; }
  em { font-style: normal; color: ${({ theme }) => theme.colors.gray12}; }
`

const Title = styled.h1`
  margin: 0; font-size: 2rem; font-weight: 800; letter-spacing: -0.01em;
`

const Form = styled.form`
  margin-top: .8rem;
`

const InputWrap = styled.div`
  display: grid;
  grid-template-columns: 28px 1fr 30px;
  align-items: center;
  gap: 10px;
  padding: .75rem .9rem;
  border: 1px solid ${({ theme }) => theme.colors.gray7};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.gray2};
  color: ${({ theme }) => theme.colors.gray12};
  transition: border-color 120ms ease, box-shadow 120ms ease;

  input {
    width: 100%; background: transparent; border: 0; outline: 0;
    color: inherit;
  }

  kbd {
    display: inline-block; text-align: center; color: ${({ theme }) => theme.colors.gray10};
    border: 1px solid ${({ theme }) => theme.colors.gray7};
    border-radius: 6px; padding: 2px 6px; font-size: .8rem;
  }

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.gray8};
    box-shadow: 0 0 0 3px rgba(100, 150, 240, 0.15);
  }
`

const Icon = styled.svg`
  width: 18px; height: 18px; stroke: currentColor; fill: none; stroke-width: 1.6;
`

const Main = styled.section``

const Empty = styled.p`
  color: ${({ theme }) => theme.colors.gray11};
  font-size: 0.95rem;
  margin-top: 1rem;
  code {
    background: ${({ theme }) => theme.colors.gray3};
    border: 1px solid ${({ theme }) => theme.colors.gray7};
    padding: 2px 6px; border-radius: 6px;
  }
`

const List = styled.div`
  display: grid; gap: 12px; margin-top: .6rem;
`

const Item = styled(Link)`
  display: block;
  border: 1px solid ${({ theme }) => theme.colors.gray7};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.gray3};
  padding: 12px 14px 14px 14px;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.gray12};
  transition: transform 120ms ease, border-color 120ms ease, box-shadow 120ms ease;

  &:hover { transform: translateY(-2px); border-color: ${({ theme }) => theme.colors.gray8}; box-shadow: 0 6px 18px rgba(0,0,0,0.25); }

  h3 { margin: 0; font-size: 1.06rem; font-weight: 800; letter-spacing: -0.01em; }
  .excerpt { margin: 6px 0 0 0; color: ${({ theme }) => theme.colors.gray11}; line-height: 1.5; font-size: 0.95rem; }
`

const Meta = styled.div`
  margin-top: 8px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  color: ${({ theme }) => theme.colors.gray10};
`

const Badge = styled(Link)`
  text-decoration: none;
  border: 1px solid ${({ theme }) => theme.colors.gray7};
  background: ${({ theme }) => theme.colors.gray3};
  color: ${({ theme }) => theme.colors.gray10};
  padding: 2px 6px; border-radius: 6px; font-size: .85rem;
  &:hover { color: ${({ theme }) => theme.colors.gray12}; border-color: ${({ theme }) => theme.colors.gray8}; }
`

const Tags = styled.div`
  display: inline-flex; gap: 8px; margin-left: auto;
  small {
    color: ${({ theme }) => theme.colors.gray10};
    background: ${({ theme }) => theme.colors.gray3};
    border: 1px solid ${({ theme }) => theme.colors.gray7};
    padding: 2px 6px; border-radius: 6px; line-height: 1.4;
  }
`
