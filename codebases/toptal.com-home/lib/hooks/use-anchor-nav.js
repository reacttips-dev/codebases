import {
    useCallback,
    useEffect
} from 'react'

import scrollToElement from '~/lib/scroll-to-element'

import {
    useIsIE11
} from './use-is-ie11'

export const useAnchorNav = offset => {
    const isIE11 = useIsIE11()

    const handleHashChange = useCallback(() => {
        if (!isIE11) {
            scrollToElement(location.hash.replace('#', ''), offset, 'auto')
        }
    }, [offset, isIE11])

    useEffect(() => {
        window.addEventListener('hashchange', handleHashChange)
        document.addEventListener('DOMContentLoaded', handleHashChange)

        return () => {
            window.removeEventListener('hashchange', handleHashChange)
        }
    }, [handleHashChange])

    const preventDoubleNav = e => {
        if (e.target.getAttribute('href') === window.location.hash) {
            e.preventDefault()
        }
    }

    const updateHash = useCallback(item => {
        if (window.location.hash && item && item.id) {
            // change hash without triggering 'hashchange' event to avoid it to jump up.
            window.history.replaceState(
                null,
                null,
                document.location.pathname + '#' + item.id
            )
        }
    }, [])

    return [preventDoubleNav, updateHash]
}