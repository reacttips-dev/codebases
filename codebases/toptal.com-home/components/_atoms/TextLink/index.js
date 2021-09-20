import React from 'react'
import classNames from 'classnames'

import {
    VariantPropTypes
} from '~/lib/prop-types'
import getVariants from '~/lib/get-variants'

import GenericLink from '~/components/_atoms/GenericLink'

import './text-link.scss'

const Variant = {
    Theme: {
        DarkGrey: 'dark-grey',
        LightGrey: 'light-grey',
        Blue: 'blue',
        White: 'white'
    },
    Underline: {
        Always: 'always',
        None: 'none',
        Default: 'default',
        Hover: 'hover'
    }
}

const TextLink = ({
    theme = Variant.Theme.Blue,
    underline = Variant.Underline.Hover,
    ...props
}) => ( <
    GenericLink { ...props
    }
    styleName = {
        classNames(
            getVariants({
                theme,
                underline
            })
        )
    }
    />
)

TextLink.propTypes = {
    ...GenericLink.propTypes,
    theme: VariantPropTypes(Variant.Theme),
    underline: VariantPropTypes(Variant.Underline)
}

TextLink.Variant = Variant
TextLink.displayName = 'TextLink'

export default TextLink