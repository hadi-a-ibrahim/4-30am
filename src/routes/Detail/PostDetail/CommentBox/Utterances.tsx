// src/routes/Detail/PostDetail/CommentBox/Utterances.tsx
import { useEffect, useRef } from "react"
import styled from "@emotion/styled"
import { CONFIG } from "site.config"

export default function Utterances() {
  const ref = useRef<HTMLDivElement | null>(null)

  // read config once
  const repo = CONFIG?.utterances?.config?.repo || ""
  const issueTerm = CONFIG?.utterances?.config?.["issue-term"] || "og:title"
  const label = CONFIG?.utterances?.config?.label || ""
  const theme =
    CONFIG?.blog?.scheme === "dark"
      ? "github-dark"
      : CONFIG?.blog?.scheme === "light"
      ? "github-light"
      : "preferred-color-scheme" // auto

  useEffect(() => {
    if (typeof window === "undefined") return
    const el = ref.current
    if (!el || !repo) return

    // idempotency guard — skip if we already mounted with same inputs
    const nextKey = `${repo}|${issueTerm}|${label}|${theme}`
    const currentKey = el.getAttribute("data-u-key")
    if (currentKey === nextKey) return
    el.setAttribute("data-u-key", nextKey)

    // clear previous mount
    while (el.firstChild) el.removeChild(el.firstChild)

    const s = document.createElement("script")
    s.src = "https://utteranc.es/client.js"
    s.async = true
    s.crossOrigin = "anonymous"
    s.setAttribute("repo", repo)
    s.setAttribute("issue-term", issueTerm)
    s.setAttribute("theme", theme)
    if (label) s.setAttribute("label", label)

    el.appendChild(s)

    // no teardown needed beyond key-check above
  }, [repo, issueTerm, label, theme])

  if (!repo) return null
  return <Box ref={ref} />
}

/* ---------------- styled ---------------- */

const Box = styled.div`
  margin-top: 2rem;
  /* Utterances injects an <iframe> */
  iframe { width: 100% !important; }
`
