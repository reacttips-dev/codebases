import {
    appEnv,
    isBrowser
} from '@toptal/frontier'
import React from 'react'
import {
    Helmet
} from 'react-helmet'

import {
    AppEnv
} from '~/lib/constants'

import favicon32 from './assets/favicon32x32.png'
import favicon57 from './assets/favicon57x57.png'
import favicon72 from './assets/favicon72x72.png'
import favicon114 from './assets/favicon114x114.png'
import faviconDevelopment from './assets/favicon-development.png'
import faviconStaging from './assets/favicon-staging.png'

const Favicon = () => {
    let favicon = faviconDevelopment

    switch (appEnv) {
        case AppEnv.Staging:
            favicon = faviconStaging
            break

        case AppEnv.Production:
            favicon = favicon32
            break
    }

    return (!isBrowser() && ( <
        Helmet >
        <
        link rel = "icon"
        href = {
            favicon
        }
        /> <
        link rel = "apple-touch-icon-precomposed"
        sizes = "57x57"
        href = {
            favicon57
        }
        /> <
        link rel = "apple-touch-icon-precomposed"
        sizes = "72x72"
        href = {
            favicon72
        }
        /> <
        link rel = "apple-touch-icon-precomposed"
        sizes = "114x114"
        href = {
            favicon114
        }
        /> <
        /Helmet>
    ))
}

export default Favicon