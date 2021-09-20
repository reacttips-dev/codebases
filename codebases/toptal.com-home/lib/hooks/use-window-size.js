import {
    useState,
    useEffect,
    useCallback
} from 'react'
import {
    debounce
} from 'lodash'

export function useWindowSize(DEBOUNCE_DELAY = 100) {
    const isClient = typeof window === 'object'

    const getSize = useCallback(() => {
        return {
            width: isClient ? window.innerWidth : undefined,
            height: isClient ? window.innerHeight : undefined
        }
    }, [isClient])

    const [size, setSize] = useState(getSize)

    useEffect(() => {
        if (!isClient) {
            return false
        }

        const handleResize = () => setSize(getSize())
        const debouncedHandleResize = debounce(handleResize, DEBOUNCE_DELAY)

        window.addEventListener('resize', debouncedHandleResize)
        return () => {
            window.removeEventListener('resize', debouncedHandleResize)
        }
    }, [DEBOUNCE_DELAY, isClient, getSize])

    return size
}