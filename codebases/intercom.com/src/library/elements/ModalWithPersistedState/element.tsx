import FocusTrap from '@daniel.husar/focus-trap'
import classnames from 'classnames'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { v4 as uuid } from 'uuid'
import { mq } from '../../utils'
import { CloseButton } from '../CloseButton'
import { IProps } from './index'

const ANIMATION_DURATION = 200

export function ModalWithPersistedState({
  children,
  onRequestClose,
  size,
  backgroundColor,
  overlayBackgroundColor,
  showCloseIcon = true,
  isOpen = false,
  className,
}: IProps) {
  const wrap = useRef<HTMLDivElement>(null)
  const focusTrap = useRef<FocusTrap | null>(null)
  const [node, setNode] = useState<HTMLDivElement | null>(null)

  const modalInnerClassnames = classnames('modal__inner', {
    [`${className}`]: className,
  })

  useEffect(() => {
    const node = document.createElement('div')
    node.id = `modal-${uuid()}`
    document.body.appendChild(node)
    setNode(node)
    return () => {
      node.parentNode?.removeChild(node)
      document.body.classList.remove('body__modal-open')
    }
  }, [])

  useEffect(() => {
    if (focusTrap.current) {
      focusTrap.current.recalculateFocusableElements()
    }
  })

  useEffect(() => {
    if (isOpen && wrap?.current) {
      focusTrap.current = new FocusTrap({ node: wrap?.current })
      document.body.classList.add('body__modal-open')
      const firstFocusableElement = wrap.current?.querySelector('button, input, a') as HTMLElement
      firstFocusableElement?.focus()
    } else {
      focusTrap.current?.restore()
      document.body.classList.remove('body__modal-open')
    }
  }, [isOpen])

  const handleBeforeClose = useCallback(() => {
    // Memoized to prevent re-renders.
    // Searches for instances of Wistia videos on close and pauses them.
    const vids = wrap.current?.querySelectorAll('.wistia-embed-video')

    interface IWistiaVid extends Element {
      wistiaApi: {
        pause: () => void
      }
    }

    if (vids) {
      vids.forEach((video) => {
        const typedVid = video as IWistiaVid
        typedVid.wistiaApi?.pause()
      })
    }

    onRequestClose()
  }, [onRequestClose])

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        handleBeforeClose()
      }
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [handleBeforeClose])

  if (!node) return null

  return createPortal(
    <div className="modal__wrap" ref={wrap} aria-hidden={!isOpen}>
      {/* eslint-disable-next-line */}
      <div className="modal__overlay" onClick={handleBeforeClose} tabIndex={-1} />
      <div className={modalInnerClassnames}>
        <div className="modal__content">
          {showCloseIcon && (
            <span className="modal__close-button">
              <CloseButton onClick={handleBeforeClose} />
            </span>
          )}
          {children}
        </div>
      </div>
      <style jsx>
        {`
          .modal__wrap {
            display: flex;
            padding: 30px 0;
            background: ${overlayBackgroundColor || 'rgba(0, 0, 0, 0.5)'};
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            color: black;
            z-index: 100000;
            transition: opacity ${ANIMATION_DURATION}ms;
            opacity: ${isOpen ? 1 : 0};
            pointer-events: ${isOpen ? 'all' : 'none'};
          }

          .modal__overlay {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: -1;
          }

          .modal__close-button {
            position: absolute;
            top: 24px;
            right: 24px;
            @media (max-width: 600px) {
              top: 10px;
              right: 10px;
            }
          }

          .modal__inner {
            grid-column: content;
            position: relative;
            z-index: 1;
            width: 100%;
            max-width: ${size || '690px'};
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-items: center;
            &.watch-demo-with-image {
              @media (${mq.mobile}) {
                max-width: 340px;
              }
            }

            :global(.marketo-form-wrapper) {
              padding: 30px;

              @include media-query(tablet) {
                padding: 40px;
              }

              @include media-query(desktop) {
                padding: 50px;
              }
            }
          }

          @media (${mq.tablet}) {
            .modal__inner {
              width: auto;
              min-width: 400px;
            }
          }

          .modal__content {
            position: relative;
            background: ${backgroundColor || 'white'};
            box-shadow: rgba(75, 75, 75, 0.11) 0px 5px 10px, rgba(89, 89, 89, 0.12) 0px 5px 20px;
            overflow: auto;
            width: 100%;
            border-radius: 6px;
            min-height: 200px;
            max-height: calc(100vh - 60px);
          }

          :global(.body__modal-open) {
            overflow: hidden;
          }
        `}
      </style>
    </div>,
    node,
  )
}
