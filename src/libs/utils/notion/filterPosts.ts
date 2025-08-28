// src/libs/utils/notion.ts (filterPosts part)
import { TPosts, TPostStatus, TPostType, TPost } from "src/types"
import { pickDateString, isOnOrBeforeToday } from "src/libs/utils/formatDate"

export type FilterPostsOptions = {
  acceptStatus?: TPostStatus[]
  acceptType?: TPostType[]
}

const initialOption: FilterPostsOptions = {
  acceptStatus: ["Public"],
  acceptType: ["Post"],
}

export function filterPosts(
  posts: TPost[],
  options: FilterPostsOptions = initialOption
) {
  const { acceptStatus = ["Public"], acceptType = ["Post"] } = options

  const filteredPosts = posts
    // 1) sanity + future-date guard (IST-aware)
    .filter((post) => {
      if (!post?.title || !post?.slug) return false

      // normalize Notion date object(s) to a string first
      const raw =
        pickDateString(post?.date) ||
        pickDateString(post?.createdTime)

      if (!raw) return false

      // allow posts dated today (Asia/Kolkata) and earlier
      if (!isOnOrBeforeToday(raw)) return false

      ;(post as any).__normalizedDate = raw
      return true
    })

    // 2) status whitelist
    .filter((post) => {
      const postStatus = post?.status?.[0]
      return acceptStatus.includes(postStatus as TPostStatus)
    })

    // 3) type whitelist
    .filter((post) => {
      const postType = post?.type?.[0]
      return acceptType.includes(postType as TPostType)
    })

    // 4) ensure 'date' is always a STRING for renderers
    .map((post) => {
      const normalized =
        (post as any).__normalizedDate ||
        pickDateString(post?.date) ||
        ""
      return { ...post, date: normalized }
    })

  return filteredPosts
}
