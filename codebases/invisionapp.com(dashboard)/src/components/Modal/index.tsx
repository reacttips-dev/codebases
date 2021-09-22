/* eslint-disable react/prop-types */
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  Ref,
} from 'react'
import { createPortal } from 'react-dom'
import cx from 'classnames'
import mergeRefs from 'react-merge-refs'
import useOnClickOutside from '../../hooks/useOnClickOutside'
import ThemeProvider, { useThemeContext } from '../ThemeProvider'
import { HTMLProps } from '../../helpers/omitType'
import { Spacing, FocusManager } from '../../types'

export interface ModalProps extends HTMLProps<HTMLDivElement> {
  /**
   * Whether the Modal should be open or closed.
   */
  isOpen: boolean
  /**
   * The DOM node to render the Modal into, via a React Portal.
   */
  domNode?: Element
  /**
   * The amount of padding around the Modal
   */
  padding?: Spacing
  /**
   * If true, when clicking outside the Modal all event bubbling will be preventing, essentially causing the rest of the page to be non-interactive until the Modal is closed.
   */
  shouldDisableEventBubbling?: boolean
  /**
   * A function that gets called when closing the Modal.
   */
  onRequestClose: () => any
  /**
   * Optional callback that gets called after the Modal opens.
   */
  onAfterOpen?: () => any
  /**
   * Optional callback that gets called after the Modal closes.
   */
  onAfterClose?: () => any
  /**
   * If true, will remove all visual styling from the Modal. Useful if you're using another component as the contents of the Modal.
   */
  isUnstyled?: boolean
  /**
   * Determines how the focus management occurs. modal will automatically focus the first focusable element,
   * whereas modeless will shift focus to the container and allow a user to tab to focus the first focusable element
   */
  focusManager?: FocusManager
}

/**
 * Models are modeless dialogs which appear on top of the main content but does not disable it, make it opaque, or contain any required actions. They can be dismissed by clicking an X, pressing esc, or clicking outside the dialog.
 */
const Modal = forwardRef(function Modal(
  props: ModalProps,
  ref: Ref<HTMLDivElement>
) {
  const {
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    title,
    children,
    className,
    padding,
    onRequestClose,
    onAfterClose,
    onAfterOpen,
    isOpen,
    domNode,
    shouldDisableEventBubbling,
    isUnstyled,
    style,
    focusManager = 'modeless',
    ...rest
  } = props
  const modal = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const { theme } = useThemeContext()

  const [isVisible, setIsVisible] = useState(isOpen)

  useOnClickOutside({
    element: modal,
    eventType: 'click',
    shouldDisableEventBubbling,
    callback: () => {
      onRequestClose()
    },
  })

  const contentHasFocus = useCallback(() => {
    return (
      document.activeElement === content.current ||
      content?.current?.contains(document.activeElement)
    )
  }, [])

  const focusContent = useCallback(() => {
    if (contentHasFocus()) {
      return
    }
    if (focusManager === 'modeless') {
      content?.current?.focus()
    } else {
      const focusable = Array.prototype.slice.call(
        content?.current?.querySelectorAll(
          'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'
        )
      )
      const firstFocusable = focusable[0]
      setTimeout(() => {
        firstFocusable && firstFocusable.focus()
      }, 200)
    }
  }, [contentHasFocus, focusManager])

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 200)
      return () => clearTimeout(timer)
    }
    setIsVisible(isOpen)
  }, [isOpen])

  useEffect(() => {
    if (isOpen && isVisible) {
      focusContent()
    }
  }, [isOpen, isVisible, focusContent])

  if (!isVisible) {
    return null
  }

  const innerStyle =
    padding && !isUnstyled
      ? {
          padding: `var(--hds-spacing-${padding})`,
        }
      : {}

  const contents = (
    <div
      {...rest}
      ref={mergeRefs([modal, ref])}
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      className={cx('hds-modal', className, {
        'hds-modal-is-styled': !isUnstyled,
        'hds-modal-is-open': isOpen,
        'hds-modal-out': !isOpen && isVisible,
      })}
      style={{
        ...innerStyle,
        ...style,
      }}
    >
      <div
        id={ariaDescribedBy}
        className="hds-modal-content"
        ref={content}
        tabIndex={focusManager === 'modeless' ? -1 : undefined}
      >
        {children}
      </div>
    </div>
  )
  if (domNode) {
    return createPortal(
      <ThemeProvider theme={theme}>{contents}</ThemeProvider>,
      domNode
    )
  }
  return contents
})

Modal.defaultProps = {
  padding: '16',
  shouldDisableEventBubbling: true,
  focusManager: 'modeless',
}

export default Modal
