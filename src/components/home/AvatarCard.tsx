// src/components/home/AvatarCard.tsx
import Image from "next/image"
import styled from "@emotion/styled"
import { CONFIG } from "site.config"

type Props = {
  avatarSrc: string
  siteBio: string
  title?: string
}

export default function AvatarCard({ avatarSrc, siteBio, title }: Props) {
  const name = title || CONFIG.profile.name

  return (
    <Card>
      <Accent aria-hidden />
      <Top>
        <Image
          src={avatarSrc}
          alt={name}
          width={120}
          height={120}
          className="img"
          priority
        />
      </Top>
      <Body>
        <Name>{name}</Name>
        <Desc>{siteBio}</Desc>
      </Body>
    </Card>
  )
}

/* ---------------- styled ---------------- */

const Card = styled.aside`
  position: relative;
  border: 1px solid ${({ theme }) => theme.colors.gray7};
  border-radius: 12px;
  overflow: hidden;
  background:
    radial-gradient(120% 140% at 0% 0%, rgba(255,255,255,0.05), transparent 60%),
    ${({ theme }) => theme.colors.gray3};
  transition: transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease;

  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 14px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0,0,0,0.22);
    border-color: ${({ theme }) => theme.colors.gray8};
  }
`

const Accent = styled.div`
  position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(120deg,
    transparent 0%,
    rgba(140,170,255,0.08) 15%,
    transparent 30%,
    transparent 70%,
    rgba(140,170,255,0.06) 85%,
    transparent 100%);
  background-size: 200% 100%;
  animation: sheen 5s linear infinite;
  opacity: 0.5;
  @keyframes sheen { 0% {background-position: 200% 0;} 100% {background-position: -200% 0;} }
`

/* avatar sits naturally without cropping */
const Top = styled.div`
  .img {
    border-radius: 12px;
    object-fit: contain; /* no crop */
    background: ${({ theme }) => theme.colors.gray4};
  }
`

const Body = styled.div`
  text-align: center;
  margin-top: 10px;
`

const Name = styled.div`
  font-weight: 700;
  font-size: 0.95rem;
  margin-bottom: 4px;
`

const Desc = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.gray11};
  font-size: 0.88rem;
  line-height: 1.4;
  font-style: italic;
`
