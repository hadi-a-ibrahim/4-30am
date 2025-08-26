import Link from "next/link"
import styled from "@emotion/styled"
import MetaConfig from "src/components/MetaConfig"
import { CONFIG, CATEGORIES } from "site.config"
import type { NextPageWithLayout } from "../types"

// your existing stuff (posts prefetch etc.)
import { getPosts } from "src/apis"
import { filterPosts } from "src/libs/utils/notion"
import { queryClient } from "src/libs/react-query"
import { queryKey } from "src/constants/queryKey"
import { dehydrate } from "@tanstack/react-query"
import type { GetStaticProps } from "next"

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

  return (
    <>
      <MetaConfig {...meta} />
      <Container>
        {/* Hero Section */}
        <Hero>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CONFIG.profile.image} alt={CONFIG.profile.name} className="avatar" />
          <div className="intro">
            <h1>{CONFIG.blog.title}</h1>
            <p>{CONFIG.blog.description}</p>
            <p className="bio">{CONFIG.profile.bio}</p>
          </div>
        </Hero>

        {/* Search Bar */}
        <SearchWrapper>
          <input type="text" placeholder="Search posts..." />
        </SearchWrapper>

        {/* Categories */}
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
        </Section>

        {/* Contact */}
        <Section>
          <h2>Contact</h2>
          <ContactCard>
            <ul>
              {CONFIG.profile.github && (
                <li><a href={`https://github.com/${CONFIG.profile.github}`} target="_blank" rel="noreferrer">github</a></li>
              )}
              {CONFIG.profile.email && (
                <li><a href={`mailto:${CONFIG.profile.email}`}>email</a></li>
              )}
              {CONFIG.profile.linkedin && (
                <li><a href={`https://www.linkedin.com/in/${CONFIG.profile.linkedin}`} target="_blank" rel="noreferrer">linkedin</a></li>
              )}
              {CONFIG.profile.instagram && (
                <li><a href={`https://instagram.com/${CONFIG.profile.instagram}`} target="_blank" rel="noreferrer">instagram</a></li>
              )}
            </ul>
          </ContactCard>
        </Section>
      </Container>
    </>
  )
}

export default HomePage

/* ---------------- styled ---------------- */

const Container = styled.main`
  max-width: 980px;
  margin: 0 auto;
  padding: 2rem 1rem;
`

const Hero = styled.section`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;

  .avatar {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    border: 2px solid ${({ theme }) => theme.colors.gray7};
  }

  .intro h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 800;
  }

  .intro p {
    margin: 0.25rem 0 0 0;
    color: ${({ theme }) => theme.colors.gray11};
  }

  .bio {
    margin-top: 0.5rem;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.gray10};
  }
`

const SearchWrapper = styled.div`
  margin-bottom: 2rem;

  input {
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 10px;
    border: 1px solid ${({ theme }) => theme.colors.gray7};
    background: ${({ theme }) => theme.colors.gray2};
    color: ${({ theme }) => theme.colors.gray12};
  }

  input:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.gray8};
  }
`

const Section = styled.section`
  margin-bottom: 2.5rem;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 720px) { grid-template-columns: 1fr 1fr; }
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

const ContactCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.gray7};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.gray3};
  padding: 1rem;

  ul {
    list-style: none;
    margin: 0; padding: 0;
    display: grid;
    gap: 0.4rem;
  }

  a {
    color: ${({ theme }) => theme.colors.gray11};
    text-decoration: none;
  }

  a:hover { color: ${({ theme }) => theme.colors.gray12}; }
`
