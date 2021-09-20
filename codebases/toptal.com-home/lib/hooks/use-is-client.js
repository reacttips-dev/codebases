import {
    useState,
    useEffect
} from 'react'

/**
 * Returns [true] only on the client-side.
 * @returns {[boolean]}
 */
export function useIsClient() {
    const [isClient, setIsClient] = useState(false)
    useEffect(() => setIsClient(true), [])

    return [isClient]
}