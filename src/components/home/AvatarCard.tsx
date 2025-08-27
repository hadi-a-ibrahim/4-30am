// src/components/home/AvatarCard.tsx
import Image from "next/image"
import styled from "@emotion/styled"

type Props = {
  avatarSrc: string      // e.g. CONFIG.profile.image
  siteBio: string        // short site description (not personal bio)
  title?: string         // default: "About this site"
}

export default function AvatarCard({ avatarSrc, siteBio, title = "About this site" }: Props) {
  return (
    <Card aria-label={title}>
      <Accent aria-hidden />
      <Row>
        <Avatar>
          <Image src={avatarSrc} alt="" fill sizes="56px" className="img" />
        </Avatar>
        <Box>
          <Heading>{title}</Heading>
          <Text title={siteBio}>{siteBio}</Text>
        </Box>
      </Row>
    </Card>
  )
}

/* ---------------- styled ---------------- */

const Card = styled.aside`
  position: relative;
  border: 1px solid ${({ theme }) => theme.colors.gray7};
  border-radius: 12px;
  /* glass-ish background with a quiet gradient */
  background:
    radial-gradient(120% 140% at 0% 0%, rgba(255,255,255,0.06), transparent 60%),
    ${({ theme }) => theme.colors.gray3};
  padding: 10px 12px;
  overflow: hidden;

  /* compact footprint */
  min-height: 92px;

  /* lively but subtle interactions */
  transition: transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease, background 240ms ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 22px rgba(0,0,0,0.22);
    border-color: ${({ theme }) => theme.colors.gray8};
    /* gentle sheen shift */
    background:
      radial-gradient(120% 140% at 100% 0%, rgba(255,255,255,0.08), transparent 60%),
      ${({ theme }) => theme.colors.gray3};
  }
`

/* tiny animated accent strip for “aliveness” */
const Accent = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(
      120deg,
      transparent 0%,
      rgba(140, 170, 255, 0.08) 15%,
      transparent 30%,
      transparent 70%,
      rgba(140, 170, 255, 0.06) 85%,
      transparent 100%
    );
  background-size: 200% 100%;
  animation: sheen 5s linear infinite;
  opacity: 0.6;

  @keyframes sheen {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`

const Row = styled.div`
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 10px;
  align-items: center;
`

const Avatar = styled.div`
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  overflow: hidden;
  /* crisp edge like your cards */
  border: 1px solid ${({ theme }) => theme.colors.gray7};
  background: ${({ theme }) => theme.colors.gray4};
  .img { object-fit: cover; }
`

const Box = styled.div`
  min-width: 0; /* enable text truncation */
`

const Heading = styled.div`
  font-size: 0.93rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  margin-bottom: 2px;
`

const Text = styled.p`
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.35;
  color: ${({ theme }) => theme.colors.gray11};

  /* keep it compact: two-line clamp */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`
