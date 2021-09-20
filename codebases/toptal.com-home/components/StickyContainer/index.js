import React, {
    useRef
} from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import 'whatwg-fetch'

import {
    useSticky
} from '~/lib/hooks'

import './sticky-container.scss'

const StickyContainer = ({
    children,
    className,
    styleName,
    isSticky
}) => {
    const navRef = useRef(null)
    const isOnTop = useSticky(navRef)

    return ( <
        nav id = "nav"
        styleName = {
            classnames(
                'sticky-container', {
                    'is-sticky': isOnTop && isSticky
                },
                styleName
            )
        }
        ref = {
            navRef
        }
        className = {
            className
        } >
        {
            typeof children === 'function' ? children({
                isOnTop
            }) : children
        } <
        /nav>
    )
}

StickyContainer.propTypes = {
    styleName: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
    isSticky: PropTypes.bool
}

export default StickyContainer