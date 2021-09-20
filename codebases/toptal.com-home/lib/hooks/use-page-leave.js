import {
    isBrowser
} from '@toptal/frontier'
import {
    useEffect,
    useCallback
} from 'react'

const SENSITIVITY = 20

/**
 * Calls given function when user leaves the page
 * @param {Function} onPageLeave callback function to call when user leaves page
 * @param {any[]} args array of dependent arguments
 */
export function usePageLeave(onPageLeave) {
    const handler = useCallback(
        e => {
            if (e.clientY <= SENSITIVITY && e.relatedTarget === null) {
                onPageLeave()
            }
        }, [onPageLeave]
    )

    useEffect(() => {
        if (!isBrowser()) {
            return
        }

        document.addEventListener('mouseout', handler)
        return () => document.removeEventListener('mouseout', handler)
    }, [handler])
}