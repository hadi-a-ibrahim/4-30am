// src/hooks/useScheme.ts
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getCookie, setCookie } from "cookies-next"
import { useEffect } from "react"
import { CONFIG } from "site.config"
import { queryKey } from "src/constants/queryKey"
import { SchemeType } from "src/types"

type SetScheme = (scheme: SchemeType) => void

const useScheme = (): [SchemeType, SetScheme] => {
  const queryClient = useQueryClient()
  const followsSystemTheme = CONFIG.blog.scheme === "system"

  // Seed initial scheme from config
  const { data } = useQuery({
    queryKey: queryKey.scheme(),
    enabled: false,
    initialData: (followsSystemTheme ? "dark" : (CONFIG.blog.scheme as SchemeType)) as SchemeType,
  })

  const setScheme: SetScheme = (scheme) => {
    setCookie("scheme", scheme)
    queryClient.setQueryData(queryKey.scheme(), scheme)
  }

  useEffect(() => {
    if (typeof window === "undefined") return

    // system default if following OS
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const defaultScheme: SchemeType = followsSystemTheme ? (prefersDark ? "dark" : "light") : (data as SchemeType)

    // cookie override if present
    const cached = (getCookie("scheme") as SchemeType) || null
    const desired: SchemeType = cached || defaultScheme

    // read current from react-query cache (falls back to cookie/default)
    const current =
      (queryClient.getQueryData(queryKey.scheme()) as SchemeType | undefined) ??
      cached ??
      defaultScheme

    // ONLY write if it’s actually different (prevents loops)
    if (current !== desired) {
      setScheme(desired)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [followsSystemTheme, data])

  return [data as SchemeType, setScheme]
}

export default useScheme
