import React from 'react'
import classNames from 'classnames'

import {
    VariantPropTypes
} from '~/lib/prop-types'
import getVariants from '~/lib/get-variants'

import TextLink from '~/components/_atoms/TextLink'
import {
    ArrowIcon
} from '~/components/_atoms/Icons'

import './arrow-link.scss'

const {
    Theme,
    Underline
} = TextLink.Variant

const Variant = {
    Size: {
        Small: 'small',
        Large: 'large'
    },
    Theme,
    Underline
}

const ArrowLink = ({
    label,
    size,
    theme,
    ...props
}) => ( <
    TextLink styleName = {
        classNames('container', getVariants({
            size
        }))
    } { ...{
            theme
        }
    } { ...props
    } >
    <
    span styleName = "label" > {
        label
    } < /span> <
    ArrowIcon styleName = "icon" / >
    <
    /TextLink>
)

ArrowLink.Variant = Variant

ArrowLink.propTypes = {
    ...TextLink.propTypes,
    size: VariantPropTypes(Variant.Size)
}

ArrowLink.displayName = 'ArrowLink'

export default ArrowLink