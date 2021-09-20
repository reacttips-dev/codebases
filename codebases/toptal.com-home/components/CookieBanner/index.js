import {
    isBrowser
} from '@toptal/frontier'
import React, {
    useCallback,
    useRef,
    useState
} from 'react'
import PropTypes from 'prop-types'
import {
    createPortal
} from 'react-dom'

import {
    useIsClient
} from '~/lib/hooks'
import {
    set as setPrivacyCookie,
    hasToShowCookieBanner
} from '~/lib/privacy-cookies'
import {
    VariantPropTypes
} from '~/lib/prop-types'

import CookieBanner from './CookieBanner'
import {
    HOST_ELEMENT_ID,
    PolicyType
} from './lib/constants'
import Host from './Host'

const Container = ({
    pageInfo,
    onAccept
}) => {
    const {
        cookiePolicyType,
        cookiePolicyMessageText,
        cookiePolicyAllowText
    } = pageInfo
    const {
        current: showCookieBanner
    } = useRef(
        hasToShowCookieBanner(cookiePolicyType)
    )

    const [isBannerVisible, setIsBannerVisible] = useState(showCookieBanner)
    const [isClient] = useIsClient()

    const handleAccept = useCallback(() => {
        setIsBannerVisible(false)
        setPrivacyCookie(cookiePolicyType, true)
        onAccept()
    }, [cookiePolicyType, onAccept])

    const hostElement = document.getElementById(HOST_ELEMENT_ID)

    const cookieBanner = ( <
        CookieBanner isVisible = {
            isClient && isBannerVisible
        }
        onAccept = {
            handleAccept
        }
        messageText = {
            cookiePolicyMessageText
        }
        buttonText = {
            cookiePolicyAllowText
        }
        policyType = {
            cookiePolicyType
        }
        />
    )

    if (hostElement && isBrowser()) {
        return createPortal(cookieBanner, hostElement)
    }
}

Container.propTypes = {
    pageInfo: PropTypes.shape({
        cookiePolicyMessageText: PropTypes.string.isRequired,
        cookiePolicyAllowText: PropTypes.string.isRequired,
        cookiePolicyType: VariantPropTypes(PolicyType).isRequired
    }).isRequired,
    onAccept: PropTypes.func.isRequired
}

export default {
    Container,
    Host
}