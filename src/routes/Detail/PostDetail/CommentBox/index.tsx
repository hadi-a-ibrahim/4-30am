// src/routes/Detail/PostDetail/CommentBox/index.tsx
import dynamic from "next/dynamic"
import { CONFIG } from "site.config"

// Accept an optional prop to satisfy old call-sites (<CommentBox data={...} />)
type Props = { data?: unknown }

// Dynamically import Utterances (no props required)
const UtterancesComponent = dynamic(
  () => import("./Utterances").then((mod) => mod.default),
  { ssr: false }
)

export default function CommentBox(_props: Props) {
  // If all systems are disabled, render nothing
  if (!CONFIG?.utterances?.enable && !CONFIG?.cusdis?.enable) return null

  // Your site uses Utterances
  if (CONFIG?.utterances?.enable) {
    return <UtterancesComponent />
  }

  // (Cusdis branch removed/disabled)
  return null
}
