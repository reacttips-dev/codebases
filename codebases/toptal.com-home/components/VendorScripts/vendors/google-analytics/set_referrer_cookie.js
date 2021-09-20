/**
 * This file was duplicated from Blackfish codebase.
 * A refactor is required once we have everything working and released.
 */

import logger from '~/lib/logger'

import locationWrap from '../utils/location-wrap'

function getFragment() {
    if (typeof locationWrap.hash() === 'string') {
        return decodeURIComponent(locationWrap.hash().substring(1))
    }
}

function removeObviousSlug(fragment) {
    const referralSlugIndex = fragment.indexOf('#')
    if (referralSlugIndex > -1) {
        return locationWrap.setHash(fragment.slice(0, referralSlugIndex))
    }
}

function removeSlug(slug) {
    locationWrap.setHash(locationWrap.hash().replace(slug, ''))
    // stripping trailing # if present
    if (locationWrap.href().match(/#$/) && window.history) {
        return window.history.replaceState(
            null,
            window.document.title,
            locationWrap.href().split('#')[0]
        )
    }
}

/*
 * If user visited site with a referrer hash set, notify platform.
 * At this point anything following # in fragment is an obvious referral slug
 * e.g. `developers#accept-10x-architects`
 */
export default function setReferrerCookie(referrersUrl) {
    let fragment = getFragment()
    if (!fragment) {
        return Promise.resolve()
    }
    fragment = fragment.replace(/\./g, '#')
    removeObviousSlug(fragment)

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `referral_slug=${fragment}`
    }

    return window
        .fetch(referrersUrl, options)
        .then(response => response.json())
        .then(json => {
            if (json.slug) {
                removeSlug(json.slug)
                return fragment
            }

            return null
        })
        .catch(error => {
            logger.error('setReferrerCookie Error', {
                error,
                referrersUrl,
                options,
                fragment
            })
        })
}