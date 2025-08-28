// src/libs/utils/formatDate.ts

/** Safely pick a date string from various Notion/date shapes */
export function pickDateString(input: any): string {
  if (!input) return ""
  if (typeof input === "string") return input
  return (
    input.start ||
    input.start_date ||
    input.date ||
    input.startDate ||
    input.publishedAt ||
    ""
  )
}

/** Human-readable date like "Aug 28, 2025" */
export function formatDate(input: any, locale = "en-US"): string {
  const s = pickDateString(input)
  if (!s) return ""
  const dt = new Date(s)
  if (Number.isNaN(+dt)) return String(s)
  return dt.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  })
}

/** Format a Date to YYYY-MM-DD in a specific time zone (default: Asia/Kolkata) */
function ymdInTZ(date: Date, timeZone = "Asia/Kolkata"): string {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
  const parts = fmt.formatToParts(date)
  const y = parts.find(p => p.type === "year")?.value || "0000"
  const m = parts.find(p => p.type === "month")?.value || "01"
  const d = parts.find(p => p.type === "day")?.value || "01"
  return `${y}-${m}-${d}`
}

/** Accept posts whose date is on/before *today* in the given time zone */
export function isOnOrBeforeToday(input: any, timeZone = "Asia/Kolkata"): boolean {
  const s = pickDateString(input)
  if (!s) return false

  // Date-only string → compare against local YYYY-MM-DD (lexicographically safe)
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const todayLocal = ymdInTZ(new Date(), timeZone)
    return s <= todayLocal
    // e.g. "2025-08-28" <= "2025-08-28" → true (today shows)
  }

  // Date-time → compare timestamps
  const dt = new Date(s)
  if (Number.isNaN(+dt)) return false
  return dt.getTime() <= Date.now()
}
