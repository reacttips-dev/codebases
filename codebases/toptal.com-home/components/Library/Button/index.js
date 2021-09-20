import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import {
    VariantPropTypes
} from '~/lib/prop-types'
import getVariants, {
    getBooleanVariants
} from '~/lib/get-variants'

import './button.scss'

const Variant = {
    Theme: {
        PrimaryGreen: 'primary-green',
        PrimaryBlue: 'primary-blue',
        SecondaryGreen: 'secondary-green',
        SecondaryBlue: 'secondary-blue',
        SecondaryWhite: 'secondary-white',
        SecondaryGrey: 'secondary-grey',
        SecondaryFlat: 'secondary-flat'
    },
    Size: {
        ExtraLarge: 'extra-large',
        Large: 'large',
        Medium: 'medium',
        Small: 'small'
    }
}

const HtmlElement = {
    Link: 'a',
    Button: 'button'
}

const Button = ({
    theme = Variant.Theme.PrimaryGreen,
    size = Variant.Size.Medium,
    as: Element = HtmlElement.Button,
    className,
    disabled,
    hover,
    ...props
}) => ( <
    Element { ...props
    } { ...{
            className,
            disabled
        }
    }
    styleName = {
        classNames(
            'button',
            getVariants({
                theme,
                size
            }),
            getBooleanVariants({
                disabled,
                hover
            })
        )
    }
    />
)

Button.Variant = Variant
Button.HtmlElement = HtmlElement

Button.propTypes = {
    theme: VariantPropTypes(Variant.Theme),
    size: VariantPropTypes(Variant.Size),
    as: VariantPropTypes(HtmlElement),
    disabled: PropTypes.bool,
    hover: PropTypes.bool,
    className: PropTypes.string
}

export default Button