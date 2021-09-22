import React, { useState, useEffect, useCallback } from 'react'
import { createGlobalStyle } from 'styled-components'
// @ts-ignore
import { Portal } from 'react-portal'

type ModalPortalProps = {
  isOpened: boolean
  onOpen?: () => void
  onClose?: () => void
  onBack?: () => void
  closeOnEsc?: boolean
  close: any
  bodyClass?: string
  closeDelay?: number
  showBackButton?: boolean
  children: React.ReactChildren
}

const ModalPortal = (props: ModalPortalProps) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (props.isOpened) {
      setIsVisible(true)
    }
  }, [props.isOpened])

  const handlePortalOpen = useCallback(() => {
    setIsVisible(true)
    document.body.className = props.bodyClass ?? ''

    if (props.onOpen) {
      props.onOpen()
    }
  }, [props.bodyClass])

  const handleClose = useCallback(() => {
    document.body.className = ''

    if (props.onClose) {
      props.onClose()
    }
  }, [props.close, props.onClose])

  const beforeClose = (node?: any, removePortal?: any) => {
    // This is dumb, but without it the portal will remove its children from
    // the DOM before the exit transitions are complete
    if (isVisible) {
      setIsVisible(false)
      setTimeout(handleClose, props.closeDelay, removePortal)
    }
  }

  return (
    <>
      <GlobalStyle />
      <Portal closeOnEsc={props.closeOnEsc} onOpen={handlePortalOpen} onClose={beforeClose}>
        {React.cloneElement(props.children as any, {
          isVisible,
          onBack: props.onBack,
          showBackButton: props.showBackButton,
          closePortal: () => beforeClose(() => handleClose())
        })}
      </Portal>
    </>
  )
}

ModalPortal.defaultProps = {
  bodyClass: 'modal-open',
  closeDelay: 250,
  closeOnEsc: true,
  isOpened: false
}

const GlobalStyle = createGlobalStyle`
  body.modal-open {
    overflow-y: hidden;
  }
`

export default ModalPortal
