import {
    useState,
    useEffect,
    useCallback
} from 'react'

import {
    setCookie,
    getCookie
} from '~/lib/cookies'
import {
    useDebug,
    useIdle
} from '~/lib/hooks'
import {
    usePageLeave
} from '~/lib/hooks/use-page-leave'

import getGAInstance from '~/components/VendorScripts/vendors/google-analytics'

const VIEWED_COOKIE_KEY = 'viewedBounceModal'
const MODAL_COOKIE_MAX_AGE = 90 * 24 * 60 * 60 // 90 days in seconds
const IDLE_TIMEOUT = 60000 // 1 minutes
const DELAY_TIMEOUT = 3000 // 3 seconds

/**
 * Bounce Modals common logic hook
 * @description condition to show modal are:
 * 1. if user did NOT view it before (saved in cookie)
 * 2. if user tries to leave page after {DELAY_TIMEOUT} millis
 *    or if user is idle for {IDLE_TIMEOUT} millis
 */
export function useBounce(type) {
    const [viewed, setViewed] = useState(true)
    const [idle] = useIdle(IDLE_TIMEOUT)
    const [isDebug, setIsDebug] = useDebug()
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        setTimeout(() => setViewed(!!getCookie(VIEWED_COOKIE_KEY)), DELAY_TIMEOUT)
    }, [])

    const handleShow = useCallback(
        triggerName => () => {
            if (!viewed) {
                setViewed(true)
                setVisible(true)
                setCookie(VIEWED_COOKIE_KEY, true, {
                    maxAge: MODAL_COOKIE_MAX_AGE
                })

                if (getGAInstance()) {
                    getGAInstance().trackBounceModalView(type)
                }
            }
        }, [viewed, type]
    )

    const handleClose = useCallback(() => {
        setVisible(false)
        setIsDebug(false)
    }, [setIsDebug])

    usePageLeave(handleShow('time_on_site'))

    useEffect(() => {
        idle && handleShow('inactivity')()
    }, [viewed, idle, handleShow])

    return {
        visible,
        handleClose,
        isDebug
    }
}