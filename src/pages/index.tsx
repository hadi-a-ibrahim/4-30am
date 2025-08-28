// src/pages/index.tsx
import Link from "next/link"
import Image from "next/image"
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

export const getStaticProps: GetStaticProps = async () => {
  const posts = filterPosts(await getPosts())
  await queryClient.prefetchQuery(queryKey.posts(), () => posts)
  return {
    props: { dehydratedState: dehydrate(queryClient) },
    revalidate: CONFIG.revalidateTime,
  }
}

const HomePage: NextPageWithLayout = () => {
  const meta = {
    title: CONFIG.blog.title,
    description: CONFIG.blog.description,
    type: "website",
    url: CONFIG.link,
  }

  const links = Array.isArray(LINKS) ? LINKS : []

  return (
    <>
      <MetaConfig {...meta} />
      <Container>
        {/* Hero */}
        <Hero>
          <div className="copy">
            <TitleRow>
              <LogoWrap>
                <Image
                  src={CONFIG.profile.image}
                  alt={`${CONFIG.blog.title} logo`}
                  width={36}
                  height={36}
                  style={{ objectFit: "cover" }}
                  priority
                />
              </LogoWrap>
              <h1>{CONFIG.blog.title}</h1>
            </TitleRow>
            <p className="tagline">{CONFIG.blog.description}</p>
            <SearchWrapper>
              <input
                type="search"
                placeholder="Search posts, tags…"
                aria-label="Search"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const val = (e.target as HTMLInputElement).value.trim()
                    if (val)
                      window.location.href = `/search?q=${encodeURIComponent(
                        val
                      )}`
                  }
                }}
              />
            </SearchWrapper>
          </div>
        </Hero>

        {/* Main: categories grid */}
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
              <Link className="more" href="/category">
                Browse all categories →
              </Link>
            </MoreRow>
          </Section>
        </Main>

        {/* Links at the bottom */}
        {links.length > 0 && (
          <LinksRow>
            {links.map((it) => (
              <a
                key={it.label}
                href={it.href}
                target="_blank"
                rel="noreferrer"
              >
                {it.label}
              </a>
            ))}
          </LinksRow>
        )}

        {/* Footer */}
        <Footer>
          © {new Date().getFullYear()} — {CONFIG.blog.title}
        </Footer>
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
    margin: 0.4rem 0 0 0;
    color: ${({ theme }) => theme.colors.gray11};
  }
`

const TitleRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0;

  h1 {
    margin: 0;
    font-size: 2.25rem;
    font-weight: 800;
    letter-spacing: -0.01em;
    line-height: 1;
  }

  @media (max-width: 520px) {
    h1 {
      font-size: 1.9rem;
    }
  }
`

const LogoWrap = styled.span`
  display: inline-block;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.gray7};
  background: ${({ theme }) => theme.colors.gray4};
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
  input:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.gray8};
  }
`

const Main = styled.section``

const Section = styled.section`
  margin-bottom: 2.5rem;
  h2 {
    font-size: 1.35rem;
    margin: 0 0 0.9rem 0;
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.2rem;

  @media (min-width: 1200px) {
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  }
`

const Card = styled(Link)`
  display: block;
  border: 1px solid ${({ theme }) => theme.colors.gray7};
  border-radius: 12px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.gray3};
  transition: transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
    border-color: ${({ theme }) => theme.colors.gray8};
  }
`

const Thumb = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`

const Placeholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.06),
    rgba(255, 255, 255, 0.02)
  );
`

const Body = styled.div`
  padding: 0.9rem 1rem 1.1rem 1rem;
`
const Name = styled.h2`
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
`
const Intro = styled.p`
  margin: 0.25rem 0 0 0;
  color: ${({ theme }) => theme.colors.gray11};
  line-height: 1.5;
`

const MoreRow = styled.div`
  margin-top: 0.9rem;
  .more {
    color: ${({ theme }) => theme.colors.gray11};
    text-decoration: none;
  }
  .more:hover {
    color: ${({ theme }) => theme.colors.gray12};
  }
`

const LinksRow = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  font-size: 0.95rem;

  a {
    color: ${({ theme }) => theme.colors.gray11};
    text-decoration: none;
  }
  a:hover {
    color: ${({ theme }) => theme.colors.gray12};
    text-decoration: underline;
  }
`

const Footer = styled.footer`
  margin-top: 2.2rem;
  border-top: 1px solid ${({ theme }) => theme.colors.gray6};
  padding-top: 14px;
  color: ${({ theme }) => theme.colors.gray11};
  font-size: 0.95rem;
`
