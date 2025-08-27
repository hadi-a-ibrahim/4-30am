import Image from "next/image"
import styled from "@emotion/styled"

type Props = {
  avatarSrc: string
  siteBio: string
  title?: string
}

export default function AvatarCard({ avatarSrc, siteBio, title = "About this site" }: Props) {
  return (
    <Card aria-label={title}>
      <Row>
        <Avatar>
          <Image src={avatarSrc} alt="Avatar" fill sizes="64px" className="img" />
        </Avatar>
        <Box>
          <Heading>{title}</Heading>
          <Text>{siteBio}</Text>
        </Box>
      </Row>
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
const Row = styled.div`
  display: flex; gap: 12px; align-items: center;
`
const Avatar = styled.div`
  position: relative; width: 64px; height: 64px; border-radius: 50%;
  overflow: hidden; border: 1px solid ${({ theme }) => theme.colors.gray7};
  .img { object-fit: cover; }
`
const Box = styled.div``

const Heading = styled.div`
  font-size: 0.95rem; font-weight: 700; margin: 0 0 2px 0;
`
const Text = styled.p`
  margin: 0; font-size: 0.9rem; color: ${({ theme }) => theme.colors.gray11};
  line-height: 1.45;
`
