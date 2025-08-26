/* ---------------- Types ---------------- */
export type Category = {
  slug: string
  name: string
  intro: string
  cover?: string
}

/* ---------------- Categories ---------------- */
export const CATEGORIES: Category[] = [
  { slug: "thoughts", name: "Thoughts", intro: "Short reflections and mental models from the day.", cover: "/covers/thoughts.jpg" },
  { slug: "ideas",    name: "Ideas",    intro: "Raw concepts and experiments worth exploring.",     cover: "/covers/ideas.jpg" },
  { slug: "reviews",  name: "Reviews",  intro: "Honest takes on books, tools, and media.",          cover: "/covers/reviews.jpg" },
  { slug: "journals", name: "Journals", intro: "Personal logs, habits, and notes.",                 cover: "/covers/journals.jpg" },
]

/* ---------------- CONFIG ---------------- */
export const CONFIG = {
  // profile setting (required)
  profile: {
    name: "hadi",
    image: "/avatar.svg",
    role: "frontend developer",
    bio: "I develop everything using node.",
    email: "hadi.dev@gmail.com",
    linkedin: "hadi",
    github: "hadi",
    instagram: "",
  },
  projects: [
    { name: "The 4:30 am", href: "https://github.com/hadi-a-ibrahim/4-30am" },
  ],
  // blog setting (required)
  blog: {
    title: "the 4:30 am",
    description: "A few midnight thoughts for you to disagree with",
    scheme: "dark" as "light" | "dark" | "system",
  },
  // CONFIG configuration (required)
  link: "https://hadiibrahxm.vercel.app",
  since: 2025,
  lang: "en-US",
  ogImageGenerateURL: "https://og-image-korean.vercel.app",
  // notion configuration (required)
  notionConfig: {
    pageId: process.env.NOTION_PAGE_ID as string,
  },
  // plugins (optional)
googleAnalytics: {
  enable: false as boolean,
  config: {
    measurementId: process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID || "",
  },
},
  googleSearchConsole: {
    enable: false,
    config: {
      siteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    },
  },
  naverSearchAdvisor: {
    enable: false,
    config: {
      siteVerification: process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION || "",
    },
  },
  utterances: {
    enable: true,
    config: {
      repo: process.env.NEXT_PUBLIC_UTTERANCES_REPO || "",
      "issue-term": "og:title",
      label: "💬 Utterances",
    },
  },
  cusdis: {
    enable: false,
    config: {
      host: "https://cusdis.com",
      appid: "",
    },
  },
  isProd: process.env.VERCEL_ENV === "production",
  revalidateTime: 21600 * 7,
} 

// ✅ Support BOTH import styles:
//    import { CONFIG } from "../../site.config"   ✔️
//    import CONFIG from "../../site.config"       ✔️
export default CONFIG
