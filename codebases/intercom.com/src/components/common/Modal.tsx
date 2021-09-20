import React from 'react'

import ReactModal from 'react-modal'
import * as Utils from 'marketing-site/src/library/utils'
import { CloseButton } from 'marketing-site/src/library/elements/CloseButton'
import { AllSystemColors } from 'marketing-site/src/library/utils'

const ANIMATION_DURATION_MS = 200

export interface IProps extends ReactModal.Props {
  onRequestClose: () => void
  size?: ModalSize
  backgroundColor?: AllSystemColors
  showCloseIcon?: boolean | true
  children: React.ReactNode
  className?: string | ''
}

export enum ModalSize {
  XSmall = '400px',
  Small = '600px',
  Medium = '1000px',
  Large = '1400px',
  FullWidth = 'none',
}

if (typeof window !== 'undefined' && document.getElementById('__next')) {
  ReactModal.setAppElement('#__next')
}

export default function Modal({
  size = ModalSize.Small,
  backgroundColor = Utils.Color.Teal,
  onRequestClose,
  showCloseIcon,
  children,
  className,
  ...rest
}: IProps) {
  const modalContentStyles = {
    ...Utils.REACT_MODAL_CONTENT_STYLES,
    maxWidth: size,
    overflow: 'hidden',
    backgroundColor,
  }

  return (
    <ReactModal
      style={{
        content: modalContentStyles,
        overlay: {
          ...Utils.REACT_MODAL_OVERLAY_STYLES,
          zIndex: '300',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
      }}
      onRequestClose={onRequestClose}
      shouldCloseOnOverlayClick
      shouldCloseOnEsc
      closeTimeoutMS={ANIMATION_DURATION_MS}
      bodyOpenClassName="ReactModal__Body--open"
      className={className}
      {...rest}
    >
      {children}

      {showCloseIcon && (
        <span className="close-button">
          <CloseButton onClick={onRequestClose} />
        </span>
      )}

      <style jsx>{`
        .close-button {
          position: absolute;
          top: 24px;
          right: 24px;
        }
        :global(.ReactModal__Overlay) {
          opacity: 0;
          transition: opacity ${ANIMATION_DURATION_MS}ms ease-in-out;
        }
        :global(.ReactModal__Overlay--after-open) {
          opacity: 1;
        }
        :global(.ReactModal__Overlay--before-close) {
          opacity: 0;
        }
        :global(.ReactModal__Body--open) {
          overflow: hidden;
        }
      `}</style>
    </ReactModal>
  )
}

Modal.defaultProps = {
  showCloseIcon: true,
}
