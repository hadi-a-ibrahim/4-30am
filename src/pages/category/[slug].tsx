// src/pages/category/[slug].tsx
import Link from "next/link"
import { useRouter } from "next/router"
import styled from "@emotion/styled"
import type { GetStaticPaths, GetStaticProps } from "next"
import MetaConfig from "src/components/MetaConfig"
import { CONFIG, CATEGORIES } from "site.config"
import type { Category } from "site.config"
import { getPosts } from "src/apis"
import { filterPosts } from "src/libs/utils/notion"

/* ---------------- SSG ---------------- */

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = CATEGORIES.map((c) => ({ params: { slug: c.slug } }))
  return { paths, fallback: "blocking" }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = String(params?.slug || "")
  const cat = CATEGORIES.find((c: Category) => c.slug === slug) || null

  const all = filterPosts(await getPosts())

  // Posts that belong to this category (tag matches slug)
  const posts = (all || []).filter((p: any) => {
    if (!p || !Array.isArray(p.tags)) return false
    const tags = p.tags.map((t: any) => String(t).toLowerCase())
    return tags.includes(slug.toLowerCase())
  })

  // Tags ONLY from posts inside this category (exclude the main category tag itself)
  const categoryTags: string[] = Array.from(
    new Set(
      posts
        .flatMap((p: any) => (Array.isArray(p?.tags) ? p.tags : []))
        .filter(Boolean)
        .map((t: any) => String(t))
    )
  )
    .filter((t) => t.toLowerCase() !== slug.toLowerCase())
    .sort((a, b) => a.localeCompare(b))

  return {
    props: { cat, posts, slug, categoryTags },
    revalidate: CONFIG.revalidateTime,
  }
}

/* ---------------- Page ---------------- */

export default function CategoryPage({
  cat,
  posts,
  slug,
  categoryTags,
}: {
  cat: Category | null
  posts: any[]
  slug: string
  categoryTags: string[]
}) {
  // ✅ Hooks FIRST, always
  const router = useRouter()
  const activeTag =
    typeof router.query.t === "string" ? router.query.t.toLowerCase() : ""
  const sort = typeof router.query.s === "string" ? router.query.s : "new" // "new" | "old"

  if (!cat) return <Container>Category not found.</Container>

  const meta = {
    title: `${cat.name} — ${CONFIG.blog.title}`,
    description: cat.intro || CONFIG.blog.description,
    type: "website",
    url: `${CONFIG.link}/category/${cat.slug}`,
  }

  // Filter by active sub-tag (if any)
  const filtered = activeTag
    ? posts.filter(
        (p: any) =>
          Array.isArray(p?.tags) &&
          p.tags.map((t: any) => String(t).toLowerCase()).includes(activeTag)
      )
    : posts

  // Sort (by date string if available)
  const visiblePosts = [...filtered].sort((a: any, b: any) => {
    const ad = a?.date ? new Date(a.date).getTime() : 0
    const bd = b?.date ? new Date(b.date).getTime() : 0
    return sort === "old" ? ad - bd : bd - ad // default "new": newest first
  })

  const total = posts?.length || 0
  const shown = visiblePosts?.length || 0

  return (
    <>
      <MetaConfig {...meta} />
      <Hero>
        <HeroInner>
          <Breadcrumbs>
            <Link href="/">Home</Link>
            <span>→</span>
            <strong>{cat.name}</strong>
          </Breadcrumbs>

          <HeroTitle>{cat.name}</HeroTitle>
          {cat.intro && <HeroIntro>{cat.intro}</HeroIntro>}

          <HeroMeta>
            <span>{total} post{total === 1 ? "" : "s"}</span>
            {activeTag && (
              <>
                <Dot>•</Dot>
                <span>
                  filtered by <strong>#{activeTag}</strong>
                </span>
              </>
            )}
          </HeroMeta>
        </HeroInner>
      </Hero>

      <Shell>
        {/* Left: Category-scoped tags */}
        <AsideLeft>
          <SectionHead>
            <SectionTitle>Tags</SectionTitle>
            {activeTag ? (
              <ClearLink
                href={{ pathname: `/category/${slug}` }}
                title="Clear tag filter"
              >
                Clear
              </ClearLink>
            ) : null}
          </SectionHead>

          {categoryTags.length === 0 ? (
            <SmallMuted>No tags yet.</SmallMuted>
          ) : (
            <TagList>
              {categoryTags.map((t) => {
                const tag = t.toLowerCase()
                const isActive = tag === activeTag
                return (
                  <li key={t}>
                    <TagLink
                      href={{
                        pathname: `/category/${slug}`,
                        query: { t: tag, s: sort },
                      }}
                      className={isActive ? "active" : undefined}
                      title={t}
                    >
                      #{t}
                    </TagLink>
                  </li>
                )
              })}
            </TagList>
          )}
        </AsideLeft>

        {/* Main content */}
        <Main>
          <Toolbar>
            <ResultText>
              Showing <strong>{shown}</strong> of <strong>{total}</strong>
            </ResultText>

            <SortGroup role="radiogroup" aria-label="Sort">
              <SortLink
                href={{ pathname: `/category/${slug}`, query: { t: activeTag || undefined, s: "new" } }}
                className={sort === "new" ? "active" : undefined}
                aria-checked={sort === "new"}
              >
                Newest
              </SortLink>
              <SortLink
                href={{ pathname: `/category/${slug}`, query: { t: activeTag || undefined, s: "old" } }}
                className={sort === "old" ? "active" : undefined}
                aria-checked={sort === "old"}
              >
                Oldest
              </SortLink>
            </SortGroup>
          </Toolbar>

          {shown === 0 ? (
            <Empty>
              {activeTag ? (
                <>
                  No posts for <strong>#{activeTag}</strong>.
                </>
              ) : (
                "No posts yet in this category."
              )}
            </Empty>
          ) : (
            <Grid>
              {visiblePosts.map((post: any) => {
                const href = `/${post.slug}`
                const title = post.title || "Untitled"
                const date = post.date || ""
                const excerpt =
                  post.excerpt || post.summary || post.description || ""
                const thumb = post.thumbnail || post.cover || null

                return (
                  <Card key={post.slug} href={href}>
                    <Thumb>
                      {thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={thumb} alt={title} />
                      ) : (
                        <Placeholder />
                      )}
                    </Thumb>
                    <CardBody>
                      <CardTitle>{title}</CardTitle>
                      {excerpt && <CardExcerpt>{excerpt}</CardExcerpt>}
                      <MetaRow>
                        {date && <span>{date}</span>}
                        <Spacer />
                        <TagRow>
                          {(post.tags || [])
                            .filter(Boolean)
                            .slice(0, 3)
                            .map((t: any) => (
                              <small key={String(t)}>#{String(t)}</small>
                            ))}
                        </TagRow>
                      </MetaRow>
                    </CardBody>
                  </Card>
                )
              })}
            </Grid>
          )}
        </Main>
      </Shell>
    </>
  )
}

/* ---------------- styled ---------------- */

const Hero = styled.section`
  position: relative;
  padding: 48px 0 32px;
  margin: 0 0 8px 0;
  background:
    radial-gradient(1200px 400px at 20% -10%, rgba(255,255,255,0.08), transparent 60%),
    radial-gradient(1000px 360px at 110% -20%, rgba(255,255,255,0.06), transparent 60%);
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray6};
`

const HeroInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
`

const Breadcrumbs = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.gray11};
  font-size: 0.9rem;
  a { text-decoration: none; color: inherit; }
`

const HeroTitle = styled.h1`
  margin: 8px 0 4px 0;
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: -0.01em;
`

const HeroIntro = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.gray11};
  max-width: 70ch;
`

const HeroMeta = styled.p`
  margin: 12px 0 0 0;
  color: ${({ theme }) => theme.colors.gray10};
  display: flex;
  align-items: center;
  gap: 8px;
  strong { color: ${({ theme }) => theme.colors.gray12}; }
`

const Dot = styled.span`
  opacity: 0.6;
`

const Shell = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 18px 16px 32px 16px;
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 24px;

  @media (max-width: 860px) {
    display: block;
    padding: 16px;
  }
`

const AsideLeft = styled.aside`
  @media (max-width: 860px) { margin-bottom: 16px; }
`

const SectionHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
`

const SectionTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 800;
  margin: 0;
`

const ClearLink = styled(Link)`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.gray11};
  text-decoration: none;
  &:hover { color: ${({ theme }) => theme.colors.gray12}; }
`

const SmallMuted = styled.p`
  color: ${({ theme }) => theme.colors.gray11};
  font-size: 0.9rem;
  margin: 0;
`

const TagList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 6px;
  li { line-height: 1; }
`

const TagLink = styled(Link)`
  display: inline-block;
  padding: 6px 10px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.gray7};
  color: ${({ theme }) => theme.colors.gray11};
  text-decoration: none;
  transition: background 120ms ease, border-color 120ms ease, color 120ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.gray8};
    color: ${({ theme }) => theme.colors.gray12};
    background: ${({ theme }) => theme.colors.gray3};
  }

  &.active {
    background: ${({ theme }) => theme.colors.gray3};
    border-color: ${({ theme }) => theme.colors.gray8};
    color: ${({ theme }) => theme.colors.gray12};
  }
`

const Main = styled.section``

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: space-between;
  margin: 2px 0 12px 0;
`

const ResultText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.gray11};
  font-size: 0.95rem;
`

const SortGroup = styled.div`
  display: inline-flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.gray7};
  border-radius: 999px;
  overflow: hidden;
`

const SortLink = styled(Link)`
  font-size: 0.9rem;
  text-decoration: none;
  padding: 6px 12px;
  color: ${({ theme }) => theme.colors.gray11};
  border-right: 1px solid ${({ theme }) => theme.colors.gray7};
  &:last-of-type { border-right: none; }

  &.active {
    color: ${({ theme }) => theme.colors.gray12};
    background: ${({ theme }) => theme.colors.gray3};
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;

  @media (min-width: 720px) { grid-template-columns: 1fr 1fr; }
  @media (min-width: 1040px) { grid-template-columns: 1fr 1fr 1fr; }
`

const Card = styled(Link)`
  display: block;
  border: 1px solid ${({ theme }) => theme.colors.gray7};
  border-radius: 14px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.gray3};
  transition: transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 22px rgba(0,0,0,0.28);
    border-color: ${({ theme }) => theme.colors.gray8};
  }
`

const Thumb = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;

  img { width: 100%; height: 100%; object-fit: cover; display: block; }
`

const Placeholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
`

const CardBody = styled.div`
  padding: 12px 14px 14px 14px;
`

const CardTitle = styled.h3`
  margin: 0;
  font-size: 1.06rem;
  font-weight: 800;
  letter-spacing: -0.01em;
`

const CardExcerpt = styled.p`
  margin: 6px 0 0 0;
  color: ${({ theme }) => theme.colors.gray11};
  line-height: 1.5;
  font-size: 0.95rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 3.5em;
`

const MetaRow = styled.div`
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.gray10};
  font-size: 0.85rem;
`

const Spacer = styled.div`
  flex: 1;
`

const TagRow = styled.div`
  display: inline-flex;
  gap: 8px;
  small {
    color: ${({ theme }) => theme.colors.gray10};
    background: ${({ theme }) => theme.colors.gray3};
    border: 1px solid ${({ theme }) => theme.colors.gray7};
    padding: 2px 6px;
    border-radius: 6px;
    line-height: 1.4;
  }
`

const Empty = styled.p`
  color: ${({ theme }) => theme.colors.gray11};
  font-size: 0.95rem;
  margin-top: 1rem;
`

const Container = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`
