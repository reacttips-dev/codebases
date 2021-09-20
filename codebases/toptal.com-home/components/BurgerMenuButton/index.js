import React, {
    useCallback
} from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import './burger-menu-button.scss'

const BurgerMenuButton = ({
    onToggle,
    open,
    className
}) => {
    const handleClick = useCallback(() => onToggle(!open), [onToggle, open])

    return ( <
        button styleName = {
            classNames('toggle', {
                open
            })
        }
        className = {
            className
        }
        type = "button"
        onClick = {
            handleClick
        }
        aria - label = "menu" >
        <
        span / >
        <
        span / >
        <
        span / >
        <
        /button>
    )
}

BurgerMenuButton.propTypes = {
    onToggle: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    className: PropTypes.string
}

export default BurgerMenuButton