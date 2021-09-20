import {
    isBrowser
} from '@toptal/frontier'
import React, {
    useRef,
    useEffect,
    useCallback
} from 'react'
import {
    CSSTransition
} from 'react-transition-group'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import isVisualRegressionTest from '~/lib/is-visual-regression-test'
import {
    getBooleanVariants
} from '~/lib/get-variants'
import {
    useToggle,
    useToggleBodyClass
} from '~/lib/hooks'

import Panel from '../Panel'
import Content from '../Content'
import Header from '../Header'
import {
    HOST_ELEMENT_ID,
    TRANSITION_DURATION
} from '../lib/constants'
import {
    getTransitionStyles
} from '../lib/utils'

import styles from './controller.scss'

const transitionStyles = getTransitionStyles(styles)

/**
 * Sidebar.Controller component
 */
const Controller = ({
    isOpen,
    onDismiss,
    children
}) => {
    const ref = useRef(null)

    useToggleBodyClass(
        isOpen, !isVisualRegressionTest && styles['sidebar-is-open']
    )

    const handleKeyDown = useCallback(
        e => {
            if (e.key === 'Escape') {
                onDismiss()
            }
        }, [onDismiss]
    )

    useEffect(() => {
        if (isOpen) {
            ref.current.focus()
        }
    }, [isOpen])

    const [isSticky, toggleSticky] = useToggle(false)

    if (!isBrowser()) {
        return null
    }

    const hostElement = document.getElementById(HOST_ELEMENT_ID)

    const content = ( <
        CSSTransition in = {
            isOpen
        }
        timeout = {
            TRANSITION_DURATION
        }
        mountOnEnter unmountOnExit { ...(!isVisualRegressionTest && {
                classNames: transitionStyles
            })
        } >
        <
        div tabIndex = "-1"
        onKeyDown = {
            handleKeyDown
        }
        styleName = {
            classNames(
                'container',
                getBooleanVariants({
                    isVisualRegressionTest
                })
            )
        } { ...{
                ref
            }
        } >
        <
        Panel { ...{
                onDismiss,
                isOpen
            }
        }
        parentRef = {
            ref
        } >
        <
        Header { ...{
                onDismiss,
                isSticky
            }
        }
        /> <
        Content onScrollToggle = {
            toggleSticky
        } > {
            children
        } < /Content> <
        /Panel> <
        /div> <
        /CSSTransition>
    )

    if (hostElement && isBrowser()) {
        return ReactDOM.createPortal(content, hostElement)
    }

    // fall back to inline rendering
    // eslint-disable-next-line no-console
    console.warn(
        `Could not find #${HOST_ELEMENT_ID} node.\n Switched to inline rendering mode.`
    )

    return content
}

Controller.propTypes = {
    onDismiss: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    isOpen: PropTypes.bool
}

export default Controller