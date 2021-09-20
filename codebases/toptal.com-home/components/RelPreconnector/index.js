import {
    publicPath,
    isBrowser
} from '@toptal/frontier'
import React from 'react'
import PropTypes from 'prop-types'
import {
    Helmet
} from 'react-helmet'

import {
    uploadsUri
} from '~/lib/config'

import PRE_CONNECT_ENDPOINTS from './endpoints'

const RelPreconnector = props => {
    const scripts = []

    Object.keys(PRE_CONNECT_ENDPOINTS).forEach(key => {
        if (props[key]) {
            scripts.push(PRE_CONNECT_ENDPOINTS[key])
        }
    })

    // only generated in case of server side rendering
    return (!isBrowser() && ( <
        Helmet >
        <
        link rel = "dns-prefetch"
        href = {
            publicPath
        }
        /> <
        link rel = "preconnect"
        href = {
            publicPath
        }
        /> <
        link rel = "preconnect"
        href = {
            publicPath
        }
        crossOrigin = "" / >

        <
        link rel = "dns-prefetch"
        href = {
            uploadsUri
        }
        /> <
        link rel = "preconnect"
        href = {
            uploadsUri
        }
        />

        <
        link rel = "dns-prefetch"
        href = {
            PRE_CONNECT_ENDPOINTS.sentrySettings
        }
        />

        {
            scripts.flat().map(link => ( <
                link key = {
                    link
                }
                rel = "dns-prefetch"
                href = {
                    link
                }
                />
            ))
        } <
        /Helmet>
    ))
}

RelPreconnector.propTypes = {
    appinfoSettings: PropTypes.object,
    fullstorySettings: PropTypes.object,
    googleAnalyticsSettings: PropTypes.object,
    googleTagManagerSettings: PropTypes.object,
    hubspotSettings: PropTypes.object,
    facebookSettings: PropTypes.object,
    linkedinInsightsSettings: PropTypes.object,
    trustpilotSettings: PropTypes.object
}

export default RelPreconnector