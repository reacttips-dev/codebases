import {
    useRef,
    useEffect
} from 'react'

import {
    trackGAEvent
} from '~/components/VendorScripts/vendors/google-analytics'

/**
 * Sends Scroll Depth percentage before page close
 * @param {string?} gaCategory
 */
export function useTrackScrollDepth(
    gaCategory = 'scroll_depth',
    gaAction = 'scroll_distance_percentage'
) {
    const percentageRef = useRef(0)

    useEffect(() => {
        /**
         * Updates "percentage" on page scroll
         */
        const handleScroll = () => {
            const rootElement = document.documentElement
            const body = document.body

            const scrollTopHeight = rootElement.scrollTop || body.scrollTop
            const fullHeight = rootElement.scrollHeight || body.scrollHeight
            const visibleHeight = rootElement.clientHeight

            const ratioScrolled = scrollTopHeight / (fullHeight - visibleHeight)

            const newPercentage = Math.floor(ratioScrolled * 100)

            if (newPercentage > percentageRef.current) {
                percentageRef.current = newPercentage
            }
        }

        window.addEventListener('scroll', handleScroll, false)

        return () => window.removeEventListener('scroll', handleScroll)
    }, [percentageRef, gaCategory])

    useEffect(() => {
        /**
         * Sends GA Event
         */
        const handleBeforeUnload = () => {
            trackGAEvent(gaCategory, gaAction, undefined, {
                value: percentageRef.current,
                transport: 'beacon'
            })
        }

        window.addEventListener('beforeunload', handleBeforeUnload, false)

        return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }, [gaCategory, gaAction, percentageRef])
}