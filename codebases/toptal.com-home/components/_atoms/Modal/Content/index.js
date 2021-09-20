import React from 'react'

import {
    useOutsideClick
} from '~/lib/hooks'

import {
    useModalContext
} from '../lib'

import '../modal.scss'

/**
 * Modal.Content component
 */
export const ModalContent = ({
    className,
    children,
    ...props
}) => {
    const {
        onDismiss,
        parentRef
    } = useModalContext()
    const ref = useOutsideClick(onDismiss, parentRef)

    return ( <
        div styleName = "modal"
        className = {
            className
        }
        ref = {
            ref
        } { ...props
        } > {
            children
        } <
        /div>
    )
}