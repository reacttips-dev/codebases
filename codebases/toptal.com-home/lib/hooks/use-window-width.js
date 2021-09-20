import {
    useState,
    useEffect,
    useCallback
} from 'react'
import {
    debounce
} from 'lodash'

import {
    useIsMounted
} from './use-is-mounted'

export function useWindowWidth(DEBOUNCE_DELAY = 100) {
    const isClient = typeof window === 'object'

    const isMounted = useIsMounted()

    const getWidth = useCallback(() => {
        return isClient ? window.innerWidth : undefined
    }, [isClient])

    const [width, setWidth] = useState(getWidth)

    const debouncedHandleResize = useCallback(
        debounce(() => {
            if (!isMounted.current) {
                return
            }
            setWidth(getWidth())
        }, DEBOUNCE_DELAY), []
    )

    useEffect(() => {
        if (!isClient) {
            return false
        }

        window.addEventListener('resize', debouncedHandleResize)
        return () => {
            window.removeEventListener('resize', debouncedHandleResize)
        }
    }, [DEBOUNCE_DELAY, isClient, getWidth, debouncedHandleResize])

    return width
}