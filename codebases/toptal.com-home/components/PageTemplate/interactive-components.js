import {
    appEnv,
    version
} from '@toptal/frontier'
import React, {
    useState,
    useEffect
} from 'react'

import {
    AppEnv
} from '~/lib/constants'
import {
    getTrackingAllowed
} from '~/lib/privacy-cookies'
import withTimeout from '~/lib/with-timeout'
import {
    usePageInfo,
    useEventListener,
    useScrollLevelReached,
    useTrackScrollDepth
} from '~/lib/hooks'
import getClosestAncestorBy from '~/lib/get-closest-ancestor-by'

import CookieBanner from '~/components/CookieBanner'
import VendorScripts from '~/components/VendorScripts'
import BounceModal from '~/components/BounceModal'
import getGAInstance, {
    trackGAEvent
} from '~/components/VendorScripts/vendors/google-analytics'

const InteractiveComponents = ({
    requestMetadata: {
        vendorScriptsSettings,
        chameleonExperiments,
        platformSessionUrl,
        platformReferrersUrl,
        geoTargetUrl,
        companyEmailValidationsUrl,
        codeVersions: {
            blackfishCodeVersion
        }
    },
    bounceModals,
    vertical,
    slug,
    publicUrl,
    trackScrollDepth,
    showCookieBanner,
    disabledScripts
}) => {
    const pageInfo = usePageInfo()
    const [fullstorySettings, setFullstorySettings] = useState(null)
    const [trackingAllowed, setTrackingAllowed] = useState(false)

    useTrackScrollDepth()

    useEffect(() => {
        if (pageInfo) {
            setFullstorySettings(pageInfo.fullstorySettings)
            setTrackingAllowed(getTrackingAllowed(pageInfo.cookiePolicyType))
        }
    }, [pageInfo])

    useEventListener('click', e => {
        if (e.stopGAPropagation) {
            return
        }

        const target = getClosestAncestorBy(e.target, '[data-ga-category]')

        if (!target) {
            return
        }

        const {
            gaCategory,
            gaEvent,
            gaLabel
        } = target.dataset

        if (gaCategory && getGAInstance()) {
            const {
                href
            } = target
            const shouldPreventDefault = !!href && !['_blank', '_parent'].includes(target.getAttribute('target'))
            trackGAEvent(gaCategory, gaEvent, gaLabel, {
                transport: 'beacon',
                event_callback: shouldPreventDefault && withTimeout(() => (window.location = href))
            })
            shouldPreventDefault && e.preventDefault()

            if (e.shouldStopGAPropagation) {
                e.stopGAPropagation = true
            }
        }
    })

    useScrollLevelReached(level => {
        if (trackScrollDepth ? .gaCategory) {
            trackGAEvent(
                trackScrollDepth.gaCategory,
                trackScrollDepth.gaEvent || 'scroll_depth',
                level, {
                    non_interaction: true,
                    transport: 'beacon'
                }
            )
        }
    })

    const consentCallback = () => setTrackingAllowed(true)

    return ( <
        > {
            pageInfo && showCookieBanner && ( <
                CookieBanner.Container { ...{
                        pageInfo
                    }
                }
                onAccept = {
                    consentCallback
                }
                />
            )
        } <
        VendorScripts
        // Some 3rd party services don't have dev/staging accounts, and rendering would
        // lead to a spoiling of analytics.
        // TODO: it's better to turn on and off scripts in CMS, here's a work-around so far
        // @see https://github.com/toptal/frontier-pub/pull/203#discussion_r312190170
        renderProductionOnlyScripts = {
            [
                AppEnv.Production,
                AppEnv.Staging
            ].includes(appEnv)
        } { ...vendorScriptsSettings
        } { ...{
                fullstorySettings,
                trackingAllowed,
                publicUrl,
                chameleonExperiments,
                platformSessionUrl,
                platformReferrersUrl,
                disabledScripts
            }
        }
        codeVersions = {
            {
                blackfish: blackfishCodeVersion,
                frontier: version.commit
            }
        }
        /> {
            bounceModals && ( <
                BounceModal { ...bounceModals
                } { ...{
                        geoTargetUrl,
                        companyEmailValidationsUrl,
                        chameleonExperiments,
                        platformSessionUrl,
                        vertical,
                        slug
                    }
                }
                />
            )
        } <
        />
    )
}

export default InteractiveComponents