import { useCallback, useEffect } from 'react'

import { useRouter } from 'next/router'

const routerHistory: Array<{ route: string; scrollTop: number }> = []

/**
 * If navigated:
 * from <-> to
 */
const restoreScrollRoutes = {
  '/': '/[space-slug]/post/[post-address]',
  '/feed': '/[space-slug]/post/[post-address]',
  '/member/[memberId]': '/[space-slug]/post/[post-address]',
  '/[space-slug]/[section]': '/[space-slug]/post/[post-address]',
}

export const ScrollRestorer = () => {
  const router = useRouter()

  if (typeof window !== 'undefined') {
    window.history.scrollRestoration = 'manual'
  }

  const save = useCallback(() => {
    if (typeof window !== 'undefined') {
      const scrollTop = window.scrollY
      const { route } = router

      routerHistory.push({ route, scrollTop })
    }
  }, [router])

  const restore = useCallback(() => {
    const { route, scrollTop } = routerHistory[routerHistory.length - 2] || {}
    const { route: currentRoute } =
      routerHistory[routerHistory.length - 1] || {}

    // If went back to the previous page
    const restoreRoute = restoreScrollRoutes[router.route] === currentRoute

    // If haven't been to any page previousl
    if (!route || !restoreRoute || typeof window === 'undefined') return

    window.requestAnimationFrame(() => window.scrollTo(0, scrollTop))
  }, [router.route])

  useEffect(() => {
    router.events.on('routeChangeStart', save)
    router.events.on('routeChangeComplete', restore)

    return () => {
      router.events.off('routeChangeStart', save)
      router.events.off('routeChangeComplete', restore)
    }
  }, [restore, router, save])

  return null
}

export default ScrollRestorer
