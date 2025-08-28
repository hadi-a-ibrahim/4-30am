import Link from "next/link"
import styled from "@emotion/styled"

type Item = { label: string; href: string; icon?: "chess" | "link" }

export default function LinksCard({ items }: { items: Item[] }) {
  return (
    <Card aria-label="Links">
      <List>
        {items.map((it) => (
          <li key={it.label}>
            <A href={it.href} target="_blank" rel="noreferrer">
              <Icon type={it.icon || "link"} />
              <span>{it.label}</span>
              <small className="ext">↗</small>
            </A>
          </li>
        ))}
      </List>
    </Card>
  )
}

/* ---------------- styled ---------------- */

const Card = styled.aside`
  width: 100%;
  max-width: 220px;                 /* match AvatarCard width */
  margin: 0 auto;
  border: 1px solid ${({ theme }) => theme.colors.gray7};
  border-radius: 12px;
  background:
    radial-gradient(140% 160% at 0% 0%, rgba(255,255,255,0.06), transparent 60%),
    ${({ theme }) => theme.colors.gray3};
  padding: 8px;
  transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;

  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors.gray8};
    box-shadow: 0 10px 26px rgba(0,0,0,0.22);
  }
`

const List = styled.ul`
  list-style: none; margin: 0; padding: 0; display: grid; gap: 6px;
`

const A = styled(Link)`
  display: flex; align-items: center; gap: 10px;
  text-decoration: none; color: ${({ theme }) => theme.colors.gray11};
  padding: 8px 10px; border-radius: 10px;

  &:hover {
    background: ${({ theme }) => theme.colors.gray4};
    color: ${({ theme }) => theme.colors.gray12};
  }

  small.ext {
    opacity: 0; margin-left: auto; font-size: .8rem;
    color: ${({ theme }) => theme.colors.gray10};
    transition: opacity 140ms ease;
  }
  &:hover small.ext { opacity: 1; }
`

function Icon({ type }: { type: "chess" | "link" }) {
  const common = { width: 18, height: 18, strokeWidth: 1.7 }
  if (type === "chess") {
    return (
      <svg viewBox="0 0 24 24" width={common.width} height={common.height} fill="none" stroke="currentColor" strokeWidth={common.strokeWidth} aria-hidden="true">
        <path d="M8 17h8M7 21h10M10 13l2-2 1-4 1 4 2 2" />
        <path d="M10 9h4" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" width={common.width} height={common.height} fill="none" stroke="currentColor" strokeWidth={common.strokeWidth} aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L10 5" />
      <path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 1 0 7.07 7.07L14 19" />
    </svg>
  )
}
