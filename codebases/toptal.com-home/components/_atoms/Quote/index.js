import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import {
    VariantPropTypes
} from '~/lib/prop-types'
import getVariants from '~/lib/get-variants'

import {
    QuoteIcon
} from '~/components/_atoms/Icons'

import './quote.scss'

const Variant = {
    Orientation: {
        Horizontal: 'horizontal'
    }
}

const Quote = ({
    children,
    orientation,
    iconSize = 32,
    className = ''
}) => ( <
    blockquote styleName = {
        classNames('root', getVariants({
            orientation
        }))
    }
    className = {
        className
    } >
    <
    QuoteIcon styleName = "icon"
    style = {
        {
            width: iconSize,
            height: iconSize
        }
    }
    /> <
    div > {
        children
    } < /div> <
    /blockquote>
)

Quote.propTypes = {
    className: PropTypes.string,
    orientation: VariantPropTypes(Variant.Orientation),
    iconSize: PropTypes.number,
    children: PropTypes.any
}

Quote.displayName = 'Quote'
Quote.Variant = Variant

export default Quote