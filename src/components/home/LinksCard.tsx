import Link from "next/link"
import styled from "@emotion/styled"

type Item = { label: string; href: string; icon: "chess" | "link" }

export default function LinksCard({ items }: { items: Item[] }) {
  return (
    <Card aria-label="Links">
      <Title>Links</Title>
      <List>
        {items.map((it) => (
          <li key={it.label}>
            <A href={it.href} target="_blank" rel="noreferrer">
              <Icon type={it.icon} />
              <span>{it.label}</span>
            </A>
          </li>
        ))}
      </List>
    </Card>
  )
}

/* styled */
const Card = styled.aside`
  border: 1px solid ${({ theme }) => theme.colors.gray7};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.gray3};
  padding: 14px;
`
const Title = styled.div`
  font-size: 0.95rem; font-weight: 700; margin-bottom: 8px;
`
const List = styled.ul`
  list-style: none; margin: 0; padding: 0; display: grid; gap: 6px;
`
const A = styled(Link)`
  display: flex; gap: 10px; align-items: center; text-decoration: none;
  color: ${({ theme }) => theme.colors.gray11};
  padding: 8px 10px; border-radius: 10px;
  &:hover { background: ${({ theme }) => theme.colors.gray4}; color: ${({ theme }) => theme.colors.gray12}; }
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
