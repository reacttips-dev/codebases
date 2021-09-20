import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import {
    getBooleanVariants
} from '~/lib/get-variants'
import {
    VariantPropTypes
} from '~/lib/prop-types'

import {
    ToptalEmblem,
    ToptalWordmark
} from '~/components/Logos'

import LogoWordmarkPng from './LogoWordmarkPng'

import './logo-icon.scss'

export const Logos = {
    emblem: ToptalEmblem,
    wordmark: ToptalWordmark,
    // We use PNG for Google crawlers to register the correct image
    // Fixing: https://toptal-core.atlassian.net/browse/TRA-655
    wordmarkpng: LogoWordmarkPng
}

const Variant = {
    Emblem: 'emblem',
    Wordmark: 'wordmark',
    WordmarkPng: 'wordmarkpng'
}

const Logo = ({
    type = Variant.Wordmark,
    isMonotone,
    ...restProps
}) => {
    const LogoComponent = Logos[type]
    return ( <
        div styleName = {
            classNames(
                'logo',
                getBooleanVariants({
                    isMonotone
                })
            )
        } { ...restProps
        } >
        <
        LogoComponent / >
        <
        /div>
    )
}

Logo.Variant = Variant

Logo.propTypes = {
    type: VariantPropTypes(Variant),
    isMonotone: PropTypes.bool
}

export default Logo