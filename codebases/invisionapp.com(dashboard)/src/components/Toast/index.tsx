import React, { forwardRef, Ref, useState, useEffect } from 'react'
import cx from 'classnames'
import { Omit, HTMLProps } from '../../helpers/omitType'
import Icon, { IconProps } from '../../primitives/Icon'
import Box from '../Box'
import IconButton from '../IconButton'

import { ToastOrder } from './types'
import { IconName } from '../../primitives/Icon/types'
// import Alert, { AlertProps } from '../Alert'

export interface ToastProps extends Omit<HTMLProps<HTMLDivElement>, 'size'> {
  /**
   * Changes the visual association of the Toast. Opting for "system" will render a Toast with no icon.
   */
  order: ToastOrder
  /**
   * If true, will display a Close icon which will dismiss the Toast
   */
  isDismissable?: boolean
  /**
   * Optionable callback when the Toast is dismissed. Useful for side effects such as analytics tracking.
   */
  onDismiss?: () => void
  /**
   * How long the Toast should appear on screen for, in milliseconds.
   */
  timeout?: number
  /**
   * If true, will disappear after the amount of time set in the timeout prop.
   */
  hasTimeout?: boolean
  /**
   * 	Provides a label that describes the type of alert provided.
   */
  'aria-label': string
}

/**
 * Toasts provide dismissable feedback for an action the user has taken. Toasts are used for feedback that isn’t imperative to the user’s ability to complete a task.
 */
const Toast = forwardRef(function Toast(
  props: ToastProps,
  ref: Ref<HTMLDivElement>
) {
  const {
    className,
    children,
    order,
    timeout,
    onDismiss,
    hasTimeout,
    isDismissable,
    'aria-label': ariaLabel,
    ...rest
  } = props

  const [isVisible, setIsVisible] = useState(true)
  const [isInDOM, setIsInDOM] = useState(true)

  useEffect(() => {
    if (!isVisible) {
      setTimeout(() => {
        setIsInDOM(false)
      }, 200)
    }
  }, [isVisible])

  useEffect(() => {
    if (hasTimeout) {
      setTimeout(() => {
        setIsVisible(false)
      }, timeout)
    }
  }, [hasTimeout, timeout])

  function handleClick() {
    onDismiss && onDismiss()
    setIsVisible(false)
  }

  if (!isInDOM) {
    return null
  }

  let iconName: IconName = 'Warning'
  if (order === 'primary') {
    iconName = 'Info'
  } else if (order === 'success') {
    iconName = 'Check'
  }

  const hasIcon = order !== 'system'

  return (
    <Box
      {...rest}
      ref={ref}
      className={cx(
        'hds-toast hds-type-scale-body-14 hds-py-8 hds-px-12 hds-radii-7 hds-text-surface-0 hds-bg-surface-100',
        className,
        {
          'hds-toast-out': !isVisible,
          'hds-pr-8': isDismissable,
          'hds-px-12': !isDismissable,
        }
      )}
      alignItems="center"
      justifyContent="between"
      flexWrap="no-wrap"
      role={isDismissable ? 'alertdialog' : 'alert'}
      aria-label={ariaLabel}
    >
      {hasIcon && (
        <Icon
          name={iconName}
          size="24"
          color={`surface-0` as IconProps['color']}
          isDecorative
        />
      )}

      <Box
        flex="1"
        justifyContent="start"
        className={cx('hds-toast-content', {
          'hds-ml-8': hasIcon,
          'hds-mr-8': isDismissable,
        })}
      >
        {children}
      </Box>
      {isDismissable && (
        <IconButton
          className="hds-toast-icon-button"
          onClick={handleClick}
          size="32"
          aria-label="Close this alert"
        >
          <Icon name="Close" color="surface-0" size="24" isDecorative />
        </IconButton>
      )}
    </Box>
  )
})

export default Toast
