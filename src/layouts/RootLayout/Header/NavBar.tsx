import styled from "@emotion/styled"
import Link from "next/link"
import { useRouter } from "next/router"

// ⬇️ Make sure CATEGORIES is exported from site.config.(js|ts)
// Adjust the relative path if your file is in a different folder depth.
import { CONFIG, CATEGORIES } from "site.config"

const NavBar: React.FC = () => {
  const router = useRouter()

  // Build links: Home + Categories + About
  const links = [
    { id: "home", name: "Home", to: "/" },
    ...CATEGORIES.map((c) => ({
      id: c.slug,
      name: c.name,
      to: `/category/${c.slug}`,
    })),
    { id: "about", name: "About", to: "/about" },
  ]

  const isActive = (to: string) => {
    if (to === "/") return router.asPath === "/"
    return router.asPath.startsWith(to)
  }

  return (
    <StyledWrapper>
      <ul>
        {links.map((link) => (
          <li key={link.id}>
            <Link
              href={link.to}
              className={isActive(link.to) ? "active" : undefined}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </StyledWrapper>
  )
}

export default NavBar

const StyledWrapper = styled.div`
  flex-shrink: 0;

  ul {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }

  li {
    display: block;
  }

  a {
    display: inline-block;
    padding: 0.25rem 0; /* tiny click target */
    color: ${({ theme }) => theme.colors.gray11};
    text-decoration: none;
    transition: color 0.15s ease;
  }

  a:hover {
    color: ${({ theme }) => theme.colors.gray12};
  }

  a.active {
    color: ${({ theme }) => theme.colors.gray12};
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray12};
  }
`
