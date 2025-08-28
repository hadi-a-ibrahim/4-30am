// src/routes/Detail/PostDetail/CommentBox/index.tsx
import dynamic from "next/dynamic"
import { CONFIG } from "site.config"

// Accept an optional `data` prop to satisfy existing call sites,
// but we don't actually use it (Utterances reads from CONFIG).
type Props = { data?: unknown }

// Dynamically import Utterances; it has no required props
const UtterancesComponent = dynamic(
  () => import("./Utterances").then((mod) => mod.default),
  { ssr: false }
)

export default function CommentBox(_props: Props) {
  // if all comment systems are disabled, render nothing
  if (!CONFIG?.utterances?.enable && !CONFIG?.cusdis?.enable) {
    return null
  }

  if (CONFIG?.utterances?.enable) {
    return <UtterancesComponent />
  }

  // (Cusdis branch removed/disabled)
  return null
}
