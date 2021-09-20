import React from 'react'
import classNames from 'classnames'

import getVariants, {
    getBooleanVariants
} from '~/lib/get-variants'
import isVisualRegressionTest from '~/lib/is-visual-regression-test'
import {
    VariantPropTypes
} from '~/lib/prop-types'

import './spinner.scss'

const Variant = {
    Size: {
        Tiny: 'tiny',
        Small: 'small',
        Medium: 'medium',
        Large: 'large'
    }
}

/**
 * Spinner component
 * @description shows loading circular progress
 * @description has different sizes
 */
const Spinner = ({
    className,
    size = Variant.Size.Medium
}) => ( <
    div className = {
        className
    }
    styleName = {
        classNames(
            'container',
            getVariants({
                size
            }),
            getBooleanVariants({
                isStatic: isVisualRegressionTest
            })
        )
    } >
    <
    div styleName = "scale" >
    <
    svg styleName = "circular" >
    <
    circle styleName = "path"
    cx = "25"
    cy = "25"
    r = "20"
    fill = "none"
    strokeWidth = "3" /
    >
    <
    /svg> <
    /div> <
    /div>
)

Spinner.propTypes = {
    size: VariantPropTypes(Variant.Size)
}

Spinner.Variant = Variant

export default Spinner