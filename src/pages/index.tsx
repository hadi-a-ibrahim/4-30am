import Link from "next/link"
import styled from "@emotion/styled"
import MetaConfig from "src/components/MetaConfig"
import { CONFIG, CATEGORIES, LINKS } from "site.config"
import type { NextPageWithLayout } from "../types"

// existing data prefetch (left untouched)
import { getPosts } from "src/apis"
import { filterPosts } from "src/libs/utils/notion"
import { queryClient } from "src/libs/react-query"
import { queryKey } from "src/constants/queryKey"
import { dehydrate } from "@tanstack/react-query"
import type { GetStaticProps } from "next"

// new small cards
import AvatarCard from "src/components/home/AvatarCard"
import LinksCard from "src/components/home/LinksCard"

export const getStaticProps: GetStaticProps = async () => {
  const posts = filterPosts(await getPosts())
  await queryClient.prefetchQuery(queryKey.posts(), () => posts)
  return { props: { dehydratedState: dehydrate(queryClient) }, revalidate: CONFIG.revalidateTime }
}

const HomePage: NextPageWithLayout = () => {
  const meta = {
    title: CONFIG.blog.title,
    description: CONFIG.blog.description,
    type: "website",
    url: CONFIG.link,
  }

  // prep right column data
  const avatarSrc = CONFIG.profile.image
  const siteBio = CONFIG.blog.description
  const links = Array.isArray(LINKS) ? LINKS : [] // ensure safe

  return (
    <>
      <MetaConfig {...meta} />
      <Container>
        {/* Hero */}
        <Hero>
          <div className="copy">
            <h1>{CONFIG.blog.title}</h1>
            <p className="tagline">{CONFIG.blog.description}</p>
            <SearchWrapper>
              <input
                type="search"
                placeholder="Search posts, tags…"
                aria-label="Search"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const val = (e.target as HTMLInputElement).value.trim()
                    if (val) window.location.href = `/search?q=${encodeURIComponent(val)}`
                  }
                }}
              />
            </SearchWrapper>
          </div>
        </Hero>

        {/* Main 2-column layout */}
        <Shell>
          {/* Left: categories grid */}
          <Main>
            <Section>
              <h2>Categories</h2>
              <Grid>
                {CATEGORIES.map((cat) => (
                  <Card key={cat.slug} href={`/category/${cat.slug}`}>
                    <Thumb>
                      {cat.cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={cat.cover} alt={cat.name} />
                      ) : (
                        <Placeholder />
                      )}
                    </Thumb>
                    <Body>
                      <Name>{cat.name}</Name>
                      {cat.intro && <Intro>{cat.intro}</Intro>}
                    </Body>
                  </Card>
                ))}
              </Grid>

              <MoreRow>
                <Link className="more" href="/category">Browse all categories →</Link>
              </MoreRow>
            </Section>
          </Main>

          {/* Right: avatar + links */}
          <Aside>
            <AvatarCard />
          </Aside>
        </Shell>

        {/* Footer */}
        <Footer>© {new Date().getFullYear()} — {CONFIG.blog.title}</Footer>
      </Container>
    </>
  )
}

export default HomePage

/* ---------------- styled ---------------- */

const Container = styled.main`
  max-width: 1120px;
  margin: 0 auto;
  padding: 2rem 1rem;
`

const Hero = styled.header`
  margin-bottom: 1.25rem;
  .copy h1 {
    margin: 0;
    font-size: 2.25rem;
    font-weight: 800;
    letter-spacing: -0.01em;
  }
  .tagline {
    margin: .4rem 0 0 0;
    color: ${({ theme }) => theme.colors.gray11};
  }
`

const SearchWrapper = styled.div`
  margin-top: 0.9rem;
  input {
    width: 100%;
    padding: 0.8rem 1rem;
    border-radius: 12px;
    border: 1px solid ${({ theme }) => theme.colors.gray7};
    background: ${({ theme }) => theme.colors.gray2};
    color: ${({ theme }) => theme.colors.gray12};
  }
  input:focus { outline: none; border-color: ${({ theme }) => theme.colors.gray8}; }
`

const Shell = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 18px;
  @media (max-width: 900px) { 
  grid-template-columns: 1fr;
   }
`

const Main = styled.section``

const Section = styled.section`
  margin-bottom: 2.5rem;
  h2 { font-size: 1.35rem; margin: 0 0 0.9rem 0; }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  @media (min-width: 720px) { grid-template-columns: 1fr 1fr; }
`

/* 🔥 Category card: livelier hover, keyboard focus, reduced motion */
const Card = styled(Link)`
  position: relative;
  display: block;
  border: 1px solid ${({ theme }) => theme.colors.gray7};
  border-radius: 12px;
  overflow: hidden;
  background:
    radial-gradient(140% 160% at 0% 0%, rgba(255,255,255,0.06), transparent 60%),
    ${({ theme }) => theme.colors.gray3};
  transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease, background 240ms ease;
  text-decoration: none;
  color: inherit;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 26px rgba(0,0,0,0.28);
    border-color: ${({ theme }) => theme.colors.gray8};
    background:
      radial-gradient(140% 160% at 100% 0%, rgba(255,255,255,0.08), transparent 60%),
      ${({ theme }) => theme.colors.gray3};
  }

  /* keyboard focus */
  &:focus-visible {
    outline: 0;
    border-color: ${({ theme }) => theme.colors.gray9};
    box-shadow: 0 0 0 3px rgba(100, 150, 240, 0.20);
  }

  /* respect reduced motion */
  @media (prefers-reduced-motion: reduce) {
    transition: border-color 160ms ease, background 240ms ease;
    &:hover { transform: none; box-shadow: none; }
  }
`

const Thumb = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  img { width: 100%; height: 100%; object-fit: cover; display: block; }
`

/* subtle fallback texture when no cover */
const Placeholder = styled.div`
  width: 100%; height: 100%;
  background:
    linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02)),
    linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
`

const Body = styled.div` padding: 0.9rem 1rem 1.1rem 1rem; `
const Name = styled.h2` font-size: 1.2rem; font-weight: 700; margin: 0 0 0.25rem 0; `
const Intro = styled.p` margin: 0.25rem 0 0 0; color: ${({ theme }) => theme.colors.gray11}; line-height: 1.5; `

const MoreRow = styled.div`
  margin-top: 0.9rem;
  .more { color: ${({ theme }) => theme.colors.gray11}; text-decoration: none; }
  .more:hover { color: ${({ theme }) => theme.colors.gray12}; }
`

const Aside = styled.aside`
  display: grid; gap: 14px;
  @media (max-width: 900px) { 
   order: -1;   /* 👈 move above the categories on mobile */
   justify-items: center;
 }
`

const Footer = styled.footer`
  margin-top: 2.2rem;
  border-top: 1px solid ${({ theme }) => theme.colors.gray6};
  padding-top: 14px;
  color: ${({ theme }) => theme.colors.gray11};
  font-size: 0.95rem;
`
