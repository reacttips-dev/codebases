/* eslint-disable react/prop-types */

import React, {
  useState,
  useEffect,
  forwardRef,
  Ref,
  useCallback,
  useRef,
} from 'react'
import { createPortal } from 'react-dom'
import cx from 'classnames'
import mergeRefs from 'react-merge-refs'
import IconButton from '../IconButton'
import Box from '../Box'
import Icon from '../../primitives/Icon'
import ThemeProvider, { useThemeContext } from '../ThemeProvider'

import { HTMLProps } from '../../helpers/omitType'
import { Spacing } from '../../types'

export interface FullscreenProps extends HTMLProps<HTMLDivElement> {
  /**
   * If true, the Fullscreen will be visible.
   */
  isOpen: boolean
  /**
   * The HTML node to render the Fullscreen in, via a React Portal.
   */
  domNode?: Element
  /**
   * How much padding to apply around the Fullscreen.
   */
  padding?: Spacing
  /**
   * Callback that will be called whenever the Fullscreen should close. Use this callback to handle your state changes.
   */
  onRequestClose: () => any
  /**
   * Callback for any additional side effects when the Fullscreen opens.
   */
  onAfterOpen?: () => any
  /**
   * Callback for any additional side effects when the Fullscreen closes.
   */
  onAfterClose?: () => any
}
/**
 * Fullscreens are modeless dialog displaying non-required actions in a separate window that completely covers the screen. They can be dismissed by clicking an X or pressing esc.
 */
const Fullscreen = forwardRef(function Fullscreen(
  props: FullscreenProps,
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
    style,
    ...rest
  } = props
  const [isVisible, setIsVisible] = useState(isOpen)
  const { theme } = useThemeContext()
  const dialog = useRef<HTMLDivElement>(null)

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

  if (!isVisible) {
    return null
  }

  const innerStyle = padding
    ? {
        padding: `var(--hds-spacing-${padding})`,
      }
    : {}

  const contents = (
    <Box
      {...rest}
      alignItems="center"
      justifyContent="center"
      flexDirection="col"
      ref={mergeRefs([ref, dialog])}
      role="dialog"
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      className={cx('hds-fullscreen', className, {
        'hds-fullscreen-out': !isOpen && isVisible,
      })}
      style={{
        ...innerStyle,
        ...style,
      }}
    >
      <IconButton
        onClick={onRequestClose}
        aria-label="Close the fullscreen dialog"
        className="hds-fullscreen-close-action"
      >
        <Icon name="Close" isDecorative size="24" color="surface-100" />
      </IconButton>
      {children}
    </Box>
  )

  if (domNode) {
    return createPortal(
      <ThemeProvider theme={theme}>{contents}</ThemeProvider>,
      domNode
    )
  }

  return contents
})

Fullscreen.defaultProps = {
  padding: '32',
}

export default Fullscreen
