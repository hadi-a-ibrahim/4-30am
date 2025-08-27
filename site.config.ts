// site.config.ts

/* ========== Types ========== */

export type SocialLinks = {
  email?: string
  linkedin?: string
  github?: string
  instagram?: string
}

export type Profile = {
  name: string
  image: string
  role?: string
  bio?: string
} & SocialLinks

export type ProjectLink = { name: string; href: string }

export type BlogConfig = {
  title: string
  description: string
  scheme: "light" | "dark" | "system"
}

export type NotionConfig = {
  pageId?: string
}

export type AnalyticsConfig = {
  enable: boolean
  config: { measurementId: string }
}

export type VerifyConfig = { enable: boolean; config: { siteVerification: string } }

export type CommentConfig =
  | {
      enable: true
      config: {
        repo: string
        ["issue-term"]: string
        label?: string
      }
    }
  | { enable: false; config?: any }

export type CusdisConfig =
  | {
      enable: true
      config: { host: string; appid: string }
    }
  | { enable: false; config?: any }

export type AppConfig = {
  profile: Profile
  projects: ProjectLink[]
  blog: BlogConfig
  link: string
  since: number
  lang:
    | "en-US"
    | "zh-CN"
    | "zh-HK"
    | "zh-TW"
    | "ja-JP"
    | "es-ES"
    | "ko-KR"
  ogImageGenerateURL: string
  notionConfig: NotionConfig
  googleAnalytics: AnalyticsConfig
  googleSearchConsole: VerifyConfig
  naverSearchAdvisor: VerifyConfig
  utterances: CommentConfig
  cusdis: CusdisConfig
  isProd: boolean
  revalidateTime: number
}

export type CategoryChild = {
  slug: string
  name: string
  intro?: string
  cover?: string 
  emoji?: string // optional image for child landing (public/covers/*)
}

export type Category = {
  slug: string
  name: string
  intro?: string
  cover?: string // optional image for category landing (public/covers/*)
  children?: CategoryChild[]
}

/* ========== CONFIG ========== */

export const CONFIG: AppConfig = {
  // profile setting (required)
  profile: {
    name: "hadi",
    image: "/avatar.svg", // notion-avatar works too
    role: "frontend developer",
    bio: "I develop everything using node.",
    email: "hadi.dev@gmail.com",
    linkedin: "hadi",
    github: "hadi",
    instagram: "",
  },

  projects: [
    {
      name: "The 4:30 am",
      href: "https://github.com/hadi-a-ibrahim/4-30am",
    },
  ],

  // blog setting (required)
  blog: {
    title: "the 4:30 am",
    description: "A few midnight thoughts for you to disagree with",
    scheme: "dark", // 'light' | 'dark' | 'system'
  },

  // app config (required)
  link: process.env.NEXT_PUBLIC_SITE_URL || "https://4-30am.vercel.app",
  since: 2025, // leave as current year if you want it to auto-feel current
  lang: "en-US",
  ogImageGenerateURL: "https://og-image-korean.vercel.app",

  // notion configuration (required)
  notionConfig: {
    pageId: process.env.NOTION_PAGE_ID,
  },

  // plugin configuration (optional)
  googleAnalytics: {
    enable: false,
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

  // distinguish between development and production environment
  isProd: process.env.VERCEL_ENV === "production",

  // ISR revalidate time (seconds)
  revalidateTime: 21600 * 7, // 7 * 6 hours
}

/* ========== CATEGORIES ========== */

export const CATEGORIES: Category[] = [
  {
    slug: "thoughts",
    name: "Thoughts",
    intro: "Short reflections and mental models.",
    cover: "/covers/thoughts.jpg",
    children: [
      { slug: "philosophy", name: "Philosophy", intro: "On meaning & mind." },
      { slug: "love", name: "Love", intro: "Notes on the heart." },
      { slug: "writing", name: "Writing", intro: "On craft & clarity." },
    ],
  },
  {
    slug: "ideas",
    name: "Ideas",
    intro: "Raw concepts and experiments worth exploring.",
    cover: "/covers/ideas.jpg",
    children: [
      { slug: "products", name: "Products" },
      { slug: "systems", name: "Systems" },
    ],
  },
  {
    slug: "reviews",
    name: "Reviews",
    intro: "Takes on books, tools, and media.",
    cover: "/covers/reviews.jpg",
  },
  {
    slug: "journals",
    name: "Journals",
    intro: "Personal logs, habits, and notes.",
    cover: "/covers/journals.jpg",
  },
]

// === HOMEPAGE LINKS (icons card under the avatar) ===
export const LINKS = [
  { label: "Chess", href: "https://www.chess.com/member/<your-username>", icon: "chess" },
  { label: "Link Two", href: "https://example.com", icon: "link" },
  { label: "Link Three", href: "https://example.com", icon: "link" }
] as const;


/* 
How to use:
- Parent category page:   /category/<parent>  → shows a gallery of posts tagged with the parent (e.g., 'thoughts')
- Child category page:    /category/<parent>/<child> → shows a gallery of posts tagged with BOTH parent + child (e.g., 'thoughts' + 'philosophy')

In Notion:
- Tag posts with the parent tag (e.g., 'thoughts')
- Add child tag too for nested pages (e.g., 'philosophy')
*/
