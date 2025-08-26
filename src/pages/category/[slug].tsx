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
  if (!cat) return <Container>Category not found.</Container>

  const meta = {
    title: `${cat.name} — ${CONFIG.blog.title}`,
    description: cat.intro || CONFIG.blog.description,
    type: "website",
    url: `${CONFIG.link}/category/${cat.slug}`,
  }

  // 🔎 read `?t=<subtag>` from URL and filter posts in this category
  const router = useRouter()
  const activeTag =
    typeof router.query.t === "string" ? router.query.t.toLowerCase() : ""

  const visiblePosts = activeTag
    ? posts.filter(
        (p: any) =>
          Array.isArray(p?.tags) &&
          p.tags.map((t: any) => String(t).toLowerCase()).includes(activeTag)
      )
    : posts

  return (
    <>
      <MetaConfig {...meta} />
      <Container>
        {/* Left Sidebar: Tags (category-scoped) */}
        <AsideLeft>
          <SectionTitle>Tags</SectionTitle>
          {categoryTags.length === 0 ? (
            <SmallMuted>No tags yet.</SmallMuted>
          ) : (
            <TagList>
              {categoryTags.map((t) => (
                <li key={t}>
                  <TagLink
                    href={{ pathname: `/category/${slug}`, query: { t: t.toLowerCase() } }}
                    className={t.toLowerCase() === activeTag ? "active" : undefined}
                    title={t}
                  >
                    {t}
                  </TagLink>
                </li>
              ))}
            </TagList>
          )}
        </AsideLeft>

        {/* Main */}
        <Main>
          <Header>
            <h1>{cat.name}</h1>
            {cat.intro && <p>{cat.intro}</p>}
          </Header>

          {(!visiblePosts || visiblePosts.length === 0) ? (
            <Empty>
              {activeTag ? `No posts for “${activeTag}”.` : "No posts yet in this category."}
            </Empty>
          ) : (
            <Grid>
              {visiblePosts.map((post: any) => {
                const href = `/${post.slug}` // your detail page
                const title = post.title || "Untitled"
                const date = post.date || ""
                const excerpt =
                  post.excerpt || post.summary || post.description || ""
                const thumb = post.thumbnail || post.cover || null

                return (
                  <PostCard key={post.slug} href={href}>
                    <Thumb>
                      {thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={thumb} alt={title} />
                      ) : (
                        <Placeholder />
                      )}
                    </Thumb>
                    <Body>
                      <PostTitle>{title}</PostTitle>
                      {excerpt && <PostExcerpt>{excerpt}</PostExcerpt>}
                      {date && <PostMeta>{date}</PostMeta>}
                    </Body>
                  </PostCard>
                )
              })}
            </Grid>
          )}
        </Main>
      </Container>
    </>
  )
}

/* ---------------- styled ---------------- */

const Container = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr); /* only left + main */
  gap: 24px;

  @media (max-width: 840px) {
    display: block;
    padding: 1.25rem 1rem;
  }
`

const AsideLeft = styled.aside`
  @media (max-width: 840px) { margin-bottom: 1rem; }
`

const SectionTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
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
  gap: 0.35rem;

  li { line-height: 1; }
`

const TagLink = styled(Link)`
  display: inline-block;
  padding: 0.4rem 0.55rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.gray7};
  color: ${({ theme }) => theme.colors.gray11};
  text-decoration: none;
  transition: background 120ms ease, border-color 120ms ease, color 120ms ease;

  &:hover { border-color: ${({ theme }) => theme.colors.gray8}; color: ${({ theme }) => theme.colors.gray12}; }
  &.active { background: ${({ theme }) => theme.colors.gray3}; border-color: ${({ theme }) => theme.colors.gray8}; color: ${({ theme }) => theme.colors.gray12}; }
`

const Main = styled.section``

const Header = styled.header`
  margin-bottom: 1rem;
  h1 { font-size: 1.75rem; font-weight: 800; margin: 0 0 0.25rem 0; }
  p  { color: ${({ theme }) => theme.colors.gray11}; margin: 0.25rem 0 0 0; }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 720px) { grid-template-columns: 1fr 1fr; }
  @media (min-width: 1040px) { grid-template-columns: 1fr 1fr 1fr; }
`

const PostCard = styled(Link)`
  display: block;
  border: 1px solid ${({ theme }) => theme.colors.gray7};
  border-radius: 12px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.gray3};
  transition: transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0,0,0,0.25);
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

const Body = styled.div`
  padding: 0.9rem 1rem 1.1rem 1rem;
`

const PostTitle = styled.h3`
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
`

const PostExcerpt = styled.p`
  margin: 0.35rem 0 0 0;
  color: ${({ theme }) => theme.colors.gray11};
  line-height: 1.5;
  font-size: 0.95rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const PostMeta = styled.p`
  margin: 0.5rem 0 0 0;
  color: ${({ theme }) => theme.colors.gray10};
  font-size: 0.8rem;
`

const Empty = styled.p`
  color: ${({ theme }) => theme.colors.gray11};
  font-size: 0.95rem;
  margin-top: 1rem;
`
