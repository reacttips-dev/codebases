import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import {
    VariantPropTypes
} from '~/lib/prop-types'
import {
    getBooleanVariants
} from '~/lib/get-variants'

import Spinner from '~/components/_atoms/Spinner'
import LibraryButton from '~/components/Library/Button'

import './button.scss'
import {
    getAriaLabel
} from './util'

const {
    Variant,
    HtmlElement
} = LibraryButton

const Type = {
    Button: 'button',
    Submit: 'submit'
}

const SpinnerSizeMapping = {
    [Variant.Size.Small]: Spinner.Variant.Size.Tiny
}

const Button = ({
    type = Type.Submit,
    loading,
    children,
    ...props
}) => {
    const ariaLabel = getAriaLabel({
        loading,
        children
    })

    return ( <
        LibraryButton as = {
            HtmlElement.Button
        } { ...{
                type
            }
        } { ...props
        }
        styleName = {
            classNames(getBooleanVariants({
                loading
            }))
        }
        aria - label = {
            ariaLabel
        } >
        {
            loading && ( <
                Spinner styleName = "spinner"
                size = {
                    SpinnerSizeMapping[props.size] || Spinner.Variant.Size.Small
                }
                />
            )
        }

        <
        span styleName = "text" > {
            children
        } < /span> <
        /LibraryButton>
    )
}

Button.Variant = Variant
Button.Type = Type

Button.propTypes = {
    ...LibraryButton.propTypes,
    type: VariantPropTypes(Type),
    loading: PropTypes.bool
}

export default Button