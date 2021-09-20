import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import {
    defaultGutter,
    getBreakpointVariants
} from './lib'
import styles from './grid.scss'

const Grid = ({
    className,
    children,
    gutter = defaultGutter,
    role
}) => ( <
    div styleName = "container"
    className = {
        classNames(
            className,
            getBreakpointVariants(
                styles, [gutter.mobile, gutter.tablet, gutter.desktop, gutter.large],
                'gutter'
            )
        )
    } { ...{
            role
        }
    } >
    {
        children
    } <
    /div>
)

Grid.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    gutter: PropTypes.shape({
        large: PropTypes.number,
        desktop: PropTypes.number,
        tablet: PropTypes.number,
        mobile: PropTypes.number
    }),
    role: PropTypes.string
}

export {
    default as Cell
}
from './Cell'
export default Grid