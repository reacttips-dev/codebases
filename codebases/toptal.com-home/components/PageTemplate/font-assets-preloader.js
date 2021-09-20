import React from 'react'
import {
    Helmet
} from 'react-helmet'

import ProximaNovaLight from '~/assets/fonts/ProximaNova-Light.woff2'
import ProximaNovaRegular from '~/assets/fonts/ProximaNova-Regular.woff2'
import ProximaNovaBold from '~/assets/fonts/ProximaNova-Bold.woff2'

const FontAssetsPreloader = () => ( <
    Helmet >
    <
    link rel = "preload"
    href = {
        ProximaNovaLight
    }
    as = "font"
    type = "font/woff2"
    crossOrigin /
    >
    <
    link rel = "preload"
    href = {
        ProximaNovaRegular
    }
    as = "font"
    type = "font/woff2"
    crossOrigin /
    >
    <
    link rel = "preload"
    href = {
        ProximaNovaBold
    }
    as = "font"
    type = "font/woff2"
    crossOrigin /
    >
    <
    /Helmet>
)

export default FontAssetsPreloader