import React, {
    forwardRef
} from 'react'
import PropTypes from 'prop-types'

import './card.scss'

const Card = forwardRef(
    ({
        children,
        className,
        onClick,
        as: Element = 'div',
        ...rest
    }, ref) => ( <
        Element className = {
            className
        }
        styleName = "card"
        onClick = {
            onClick
        }
        ref = {
            ref
        } { ...rest
        } >
        {
            children
        } <
        /Element>
    )
)

Card.displayName = 'Card'

Card.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    as: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]).isRequired
}

export default Card