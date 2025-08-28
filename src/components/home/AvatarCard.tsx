// src/components/home/AvatarCard.tsx
import styled from "@emotion/styled"
import Image from "next/image"
import { CONFIG } from "site.config"

export default function AvatarCard() {
  return (
    <Card aria-label="Site portrait">
      <Image
        src={CONFIG.profile.image}
        alt={CONFIG.profile.name}
        fill
        priority
        sizes="220px"
        style={{ objectFit: "cover", borderRadius: "inherit" }}
      />
      <Overlay>
        <Desc>{CONFIG.blog.description}</Desc>
      </Overlay>
    </Card>
  )
}

/* ---------------- styled ---------------- */

const Card = styled.div`
  position: relative;
  border: 1px solid ${({ theme }) => theme.colors.gray7};
  border-radius: 12px;
  overflow: hidden;
  width: 100%;
  max-width: 220px;           /* smaller than category tiles */
  aspect-ratio: 3 / 4;        /* portrait */
  margin: 0 auto;             /* center inside the 300px aside column */
  background: ${({ theme }) => theme.colors.gray3};
  transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;

  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors.gray8};
    box-shadow: 0 10px 26px rgba(0,0,0,0.28);
  }

  @media (max-width: 900px) {
    max-width: 240px;         /* can grow a bit on mobile but still compact */
  }
`

const Overlay = styled.div`
  position: absolute;
  inset: auto 0 0 0;
  padding: 8px 10px;
  background: linear-gradient(to top, rgba(0,0,0,.65), rgba(0,0,0,0));
`

const Desc = styled.p`
  margin: 0;
  color: #fff;
  font-family: "Georgia", "Times New Roman", serif;  /* nicer, bookish */
  font-style: italic;
  font-size: 0.9rem;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;      /* short, no empty space */
  -webkit-box-orient: vertical;
  overflow: hidden;
`
