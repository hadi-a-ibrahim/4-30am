// src/libs/utils/formatDate.ts
export function pickDateString(input: any): string {
  if (!input) return ""
  if (typeof input === "string") return input
  // handle common Notion shapes
  return (
    input.start ||
    input.start_date ||
    input.date ||
    input.startDate ||
    input.publishedAt ||
    ""
  )
}

export function formatDate(input: any, locale = "en-US"): string {
  const s = pickDateString(input)
  if (!s) return ""
  const dt = new Date(s)
  if (Number.isNaN(+dt)) return String(s)
  return dt.toLocaleDateString(locale, { year: "numeric", month: "short", day: "2-digit" })
}
