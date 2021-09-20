import {
    isBrowser
} from '@toptal/frontier'
import React, {
    useRef,
    useEffect
} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import {
    useToggleBodyClass
} from '~/lib/hooks'

import {
    HOST_ELEMENT_ID,
    ModalContext
} from './lib'
import {
    ModalHost
} from './Host'
import {
    ModalContent
} from './Content'
import styles from './modal.scss'

/**
 * Modal component
 */
const Modal = ({
    open,
    focus,
    onDismiss,
    children,
    className,
    ...props
}) => {
    const ref = useRef(null)

    useToggleBodyClass(open, styles['modal-is-opened'])

    useEffect(() => {
        if (open && focus) {
            ref.current.focus()
        }
    }, [open, focus])

    if (!open) {
        return null
    }

    const handleEscape = e => {
        if (e.key === 'Escape') {
            onDismiss()
        }
    }

    const hostElement = document.getElementById(HOST_ELEMENT_ID)

    const content = ( <
        ModalContext.Provider value = {
            {
                onDismiss,
                parentRef: ref
            }
        } >
        <
        div styleName = "container"
        className = {
            className
        }
        onKeyDown = {
            handleEscape
        }
        ref = {
            ref
        }
        tabIndex = {
            focus && -1
        } { ...props
        } >
        {
            children
        } <
        /div> <
        /ModalContext.Provider>
    )

    if (hostElement && isBrowser()) {
        return ReactDOM.createPortal(content, hostElement)
    }

    // fallback to inline rendering
    // eslint-disable-next-line no-console
    console.warn(
        'Could not find "<Modal.Host />" node.\n Switched to inline rendering mode.'
    )

    return content
}

Modal.propTypes = {
    open: PropTypes.bool,
    focus: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
    onDismiss: PropTypes.func
}

Modal.Host = ModalHost
Modal.Content = ModalContent

export default Modal