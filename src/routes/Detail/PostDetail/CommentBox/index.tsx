// src/routes/Detail/PostDetail/CommentBox/index.tsx
import dynamic from "next/dynamic"
import { CONFIG } from "site.config"

// Dynamically import Utterances; it has **no props** now
const UtterancesComponent = dynamic(
  () => import("./Utterances").then((mod) => mod.default),
  { ssr: false }
)

export default function CommentBox() {
  // if all comment systems are disabled, render nothing
  if (!CONFIG?.utterances?.enable && !CONFIG?.cusdis?.enable) {
    return null
  }

  // your setup uses Utterances
  if (CONFIG?.utterances?.enable) {
    return <UtterancesComponent />
  }

  // (Cusdis branch removed/disabled)
  return null
}
