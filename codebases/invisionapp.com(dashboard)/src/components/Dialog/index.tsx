/* eslint-disable react/prop-types */
import React, {
  ReactNode,
  useState,
  useRef,
  useEffect,
  forwardRef,
  Ref,
  useCallback,
} from 'react'
import { createPortal } from 'react-dom'
import cx from 'classnames'
import mergeRefs from 'react-merge-refs'
import Text from '../../primitives/Text'
import Button from '../Button'
import ThemeProvider, { useThemeContext } from '../ThemeProvider'
import { Omit, HTMLProps } from '../../helpers/omitType'
import { DialogOrder } from './types'
import Box from '../Box'

export interface DialogProps extends Omit<HTMLProps<HTMLDivElement>, 'title'> {
  /**
   * If true, the Dialog will be visible.
   */
  isOpen: boolean
  /**
   * The HTML node to render the Dialog in, via a React Portal.
   */
  domNode?: Element
  /**
   * Changes the primary action Button.
   */
  order: DialogOrder
  /**
   * The text within the primary action button.
   */
  primaryButton?: string
  /**
   * The text within the secondary action button.
   */
  secondaryButton?: string
  /**
   * The text within the close action button.
   */
  closeButton: string
  /**
   * The title of the Dialog.
   */
  title: ReactNode
  /**
   * An optional image which appears above the title.
   */
  image?: ReactNode
  /**
   * Sets the maximum width of the Dialog, in pixels.
   */
  maxWidth?: number
  /**
   * Callback that will be called whenever the Dialog should close. Use this callback to handle your state changes.
   */
  onRequestClose: () => any
  /**
   * Callback for any additional side effects when clicking the primary action button.
   */
  onRequestPrimary?: () => any
  /**
   * Callback for any additional side effects when clicking the secondary action button.
   */
  onRequestSecondary?: () => any
  /**
   * Callback for any additional side effects when the Dialog opens.
   */
  onAfterOpen?: () => any
  /**
   * Callback for any additional side effects when the Dialog closes.
   */
  onAfterClose?: () => any
  /**
   * Should be a unique ID reference. This property gives the dialog an accessible
   * name by referring to the element that provides the dialog title.
   */
  'aria-labelledby': string
  /**
   * Should be a unique ID reference. This property gives the dialog an accessible
   * description by referring to the dialog content that describes the primary message or purpose of the dialog.
   */
  'aria-describedby': string
}

/**
 * Dialogs interrupt the user by covering and disabling the main content window with a modal dialog containing required actions that must be interacted with before returning to the main content.
 */
const Dialog = forwardRef(function Dialog(
  props: DialogProps,
  ref: Ref<HTMLDivElement>
) {
  const {
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    title,
    image,
    children,
    className,
    primaryButton,
    secondaryButton,
    closeButton,
    order,
    onRequestClose,
    onRequestPrimary,
    onRequestSecondary,
    onAfterClose,
    onAfterOpen,
    isOpen,
    domNode,
    maxWidth,
    ...rest
  } = props
  const dialog = useRef<HTMLDivElement>()

  const [isVisible, setIsVisible] = useState(isOpen)
  const { theme } = useThemeContext()

  const contentHasFocus = useCallback(() => {
    return (
      document.activeElement === dialog.current ||
      dialog?.current?.contains(document.activeElement)
    )
  }, [])

  const focusContent = useCallback(() => {
    if (contentHasFocus()) {
      return
    }
    const focusable = Array.prototype.slice.call(
      dialog?.current?.querySelectorAll(
        'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'
      )
    )
    const firstFocusable = focusable[0]
    setTimeout(() => {
      firstFocusable && firstFocusable.focus()
    }, 200)
  }, [contentHasFocus])

  useEffect(() => {
    if (isOpen && isVisible) {
      focusContent()
    }
  }, [isOpen, isVisible, focusContent])

  useEffect(() => {
    if (!isOpen) {
      onAfterClose && onAfterClose()
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 200)
      return () => clearTimeout(timer)
    }
    setIsVisible(isOpen)
    onAfterOpen && onAfterOpen()
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  function handlePrimary() {
    onRequestPrimary && onRequestPrimary()
    onRequestClose()
  }

  function handleSecondary() {
    onRequestSecondary && onRequestSecondary()
    onRequestClose()
  }

  function handleClose() {
    onRequestClose()
  }

  if (!isVisible) {
    return null
  }

  const contents = (
    <div className="hds-dialog">
      <div
        className={cx('hds-dialog-overlay', {
          'hds-dialog-overlay-out': !isOpen && isVisible,
        })}
        aria-hidden="true"
        onClick={onRequestClose}
      />
      <Box
        {...rest}
        alignItems="center"
        flexDirection="col"
        justifyContent="center"
        ref={mergeRefs([dialog, ref])}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        className={cx('hds-dialog-contents', className, {
          'hds-dialog-out': !isOpen && isVisible,
        })}
        style={{
          ...rest.style,
          maxWidth,
        }}
      >
        {image && (
          <figure className="hds-dialog-image hds-mb-40">{image}</figure>
        )}
        <Text
          id={ariaLabelledBy}
          className="hds-dialog-title"
          size="heading-24"
          color="surface-100"
        >
          {title}
        </Text>
        <Text
          id={ariaDescribedBy}
          className="hds-dialog-content"
          size="body-long-14"
          color="surface-80"
        >
          {children}
        </Text>

        {primaryButton && (
          <Button
            order={order === 'positive' ? 'primary' : 'destructive'}
            type="button"
            className="hds-dialog-primary-action"
            onClick={handlePrimary}
          >
            {primaryButton}
          </Button>
        )}
        {secondaryButton && (
          <Button
            order="secondary-alt"
            type="button"
            className="hds-dialog-secondary-action"
            onClick={handleSecondary}
          >
            {secondaryButton}
          </Button>
        )}
        <Button
          order="secondary-alt"
          type="button"
          className="hds-dialog-close-action"
          onClick={handleClose}
        >
          {closeButton}
        </Button>
      </Box>
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

Dialog.defaultProps = {
  maxWidth: 460,
}

export default Dialog
