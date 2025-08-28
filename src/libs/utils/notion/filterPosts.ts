import { TPosts, TPostStatus, TPostType } from "src/types"
import { pickDateString } from "src/libs/utils/formatDate"
import { TPost } from "src/types"

export type FilterPostsOptions = {
  acceptStatus?: TPostStatus[]
  acceptType?: TPostType[]
}

const initialOption: FilterPostsOptions = {
  acceptStatus: ["Public"],
  acceptType: ["Post"],
}
const current = new Date()
const tomorrow = new Date(current)
tomorrow.setDate(tomorrow.getDate() + 1)
tomorrow.setHours(0, 0, 0, 0)

export function filterPosts(posts: TPost[], options: FilterPostsOptions = initialOption) {
  const { acceptStatus = ["Public"], acceptType = ["Post"] } = options
  const filteredPosts = posts

    // 1) filter data sanity + future date guard
    .filter((post) => {
      // title/slug present?
      if (!post?.title || !post?.slug) return false

      // normalize any Notion date object to a string
      const raw = pickDateString(post?.date) || pickDateString(post?.createdTime)
      if (!raw) return false

      const postDate = new Date(raw)
      if (Number.isNaN(+postDate)) return false

      // tomorrow guard like your original
      const tomorrow = new Date()
      tomorrow.setHours(0, 0, 0, 0)
      // allow today & past; block future (strictly greater than today at 00:00?)
      // if you meant block future beyond "now", compare to Date.now()
      if (postDate > tomorrow) return false

      // stash the normalized string back for later mapping
      ;(post as any).__normalizedDate = raw
      return true
    })

    // 2) filter status
    .filter((post) => {
      const postStatus = post?.status?.[0]
      return acceptStatus.includes(postStatus)
    })

    // 3) filter type
    .filter((post) => {
      const postType = post?.type?.[0]
      return acceptType.includes(postType)
    })

    // 4) map to ensure date is always a STRING (prevents React child errors)
    .map((post) => {
      const normalized = (post as any).__normalizedDate || pickDateString(post?.date) || ""
      return {
        ...post,
        date: normalized,
      }
    })

  return filteredPosts
}
