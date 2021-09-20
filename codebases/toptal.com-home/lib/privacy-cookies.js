import {
    isBrowser
} from '@toptal/frontier'
import Cookies from 'universal-cookie'

import {
    PolicyType
} from '~/components/CookieBanner/lib/constants'

const cookies = new Cookies()
const cookieName = type => `user_agreed_${type}`

const yearInMs = 1000 * 60 * 60 * 24 * 365

const get = type => {
    if (isBrowser()) {
        return cookies.get(cookieName(type)) || false
    }
    return false
}

const set = (type, value) => {
    if (isBrowser()) {
        cookies.set(cookieName(type), value, {
            path: '/',
            expires: new Date(Date.now() + yearInMs)
        })
    }
}

/**
 * We need to show Cookie banner:
 * - when users haven't given a GDPR consent yet
 * - when users are not from EU (hence have nothing to do with GDPR)
 * Once they click "I agree" button the corresponding cookie is set and they will not see the banner.
 * If users agreed on Privacy Shield banner and then moved to EU we'll show the banner once again
 * since they haven't given a GDPR consent, and after moving it matters.
 * Details on Slack: https://toptal-core.slack.com/archives/CHV3XG9U6/p1566337622019700
 */
const hasToShowCookieBanner = type => {
    if (type === PolicyType.GDPR) {
        return !get(PolicyType.GDPR)
    }
    return !get(PolicyType.GDPR) && !get(PolicyType.PrivacyShield)
}

/**
 * Tracking is not allowed for EU-based users with no GDPR consent,
 * otherwise we show Privacy Shield to inform users but can track anyway
 */
const getTrackingAllowed = type => {
    if (type === PolicyType.GDPR) {
        return Boolean(get(PolicyType.GDPR))
    }
    return true
}

export {
    set,
    get,
    hasToShowCookieBanner,
    getTrackingAllowed
}