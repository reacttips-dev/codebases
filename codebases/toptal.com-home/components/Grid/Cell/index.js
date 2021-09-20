import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import {
    getBreakpointVariants,
    gridSize
} from '../lib'
import styles from '../grid.scss'

const Cell = ({
    children,
    className,
    mobile = gridSize,
    tablet,
    desktop,
    large,
    role
}) => ( <
    div styleName = "cell"
    className = {
        classNames(
            className,
            getBreakpointVariants(styles, [mobile, tablet, desktop, large])
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

Cell.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    mobile: PropTypes.number,
    tablet: PropTypes.number,
    desktop: PropTypes.number,
    large: PropTypes.number,
    role: PropTypes.string
}

export default Cell