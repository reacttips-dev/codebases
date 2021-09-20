import React, {
    Suspense,
    useMemo
} from 'react'
import PropTypes from 'prop-types'

import {
    isFinished
} from '~/lib/fetch-status'
import {
    MediaQuery
} from '~/lib/query-range'
import {
    useGeoData,
    useAuthState,
    AuthState
} from '~/lib/hooks'

import MatchMedia from '~/components/MatchMedia'

import {
    useBounce
} from './use-bounce'

const BounceModalContent = ({
    fullscreen,
    join,
    isWhiteListed,
    companyEmailValidationsUrl,
    chameleonExperiments,
    slug
}) => {
    const type = fullscreen ? 'fullscreen' : 'join'
    const {
        visible,
        handleClose,
        isDebug
    } = useBounce(type)

    const ModalComponent = useMemo(
        () =>
        React.lazy(() =>
            type === 'fullscreen' ?
            import ('./Hire') : import ('./Join')
        ), [type]
    )

    if ((!isWhiteListed || !visible) && !isDebug) {
        return null
    }

    const modalProps = type === 'fullscreen' ? fullscreen : join

    return ( <
        Suspense fallback = {
            null
        } >
        <
        ModalComponent open = {
            visible || isDebug
        }
        onClose = {
            handleClose
        }
        companyEmailValidationsUrl = {
            companyEmailValidationsUrl
        }
        chameleonExperiments = {
            chameleonExperiments
        }
        slug = {
            slug
        } { ...modalProps
        }
        /> <
        /Suspense>
    )
}

/**
 * BounceModal container component
 */
const BounceModal = ({
    geoTargetUrl,
    platformSessionUrl,
    ...props
}) => {
    const [geoData, geoDataFetchStatus] = useGeoData(geoTargetUrl)
    const [authState] = useAuthState(platformSessionUrl)

    if (
        authState === AuthState.LoggedIn ||
        authState === AuthState.Loading ||
        !isFinished(geoDataFetchStatus)
    ) {
        return null
    }

    return ( <
        MatchMedia query = {
            MediaQuery.Desktop
        } >
        <
        BounceModalContent { ...props
        }
        isWhiteListed = {
            geoData ? geoData.white_listed : false
        }
        /> <
        /MatchMedia>
    )
}

BounceModal.propTypes = {
    geoTargetUrl: PropTypes.string.isRequired,
    blog: PropTypes.object,
    fullscreen: PropTypes.object,
    join: PropTypes.object
}

export default BounceModal