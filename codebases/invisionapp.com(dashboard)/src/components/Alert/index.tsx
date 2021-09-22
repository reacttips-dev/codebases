import React, { forwardRef, Ref, useState, useEffect } from 'react'
import cx from 'classnames'
import { Omit, HTMLProps } from '../../helpers/omitType'
import Icon, { IconProps } from '../../primitives/Icon'
import Box from '../Box'
import IconButton from '../IconButton'

import { AlertOrder } from './types'
import { IconName } from '../../primitives/Icon/types'

export interface AlertProps extends Omit<HTMLProps<HTMLDivElement>, 'size'> {
  /**
   * Changes the visual association of the Alert
   */
  order: AlertOrder
  /**
   * If true, will display a Close icon which will dismiss the Alert
   */
  isDismissable?: boolean
  /**
   * Optionable callback when the Alert is dismissed. Useful for side effects such as analytics tracking.
   */
  onDismiss?: () => void
}

/**
 * Alerts provide feedback for an action the user has taken. They can be placed anywhere in a layout to associate the feedback with the action.
 */
const Alert = forwardRef(function Alert(
  props: AlertProps,
  ref: Ref<HTMLDivElement>
) {
  const {
    className,
    children,
    order,
    isDismissable,
    onDismiss,
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

  return (
    <Box
      {...rest}
      ref={ref}
      className={cx(
        'hds-alert hds-type-scale-body-14 hds-py-8 hds-px-12 hds-radii-7',
        className,
        {
          'hds-alert-out': !isVisible,
          [`hds-bg-${order}-10`]: order,
          [`hds-text-surface-100`]: order,
        }
      )}
      alignItems="center"
      justifyContent="between"
      flexWrap="no-wrap"
    >
      <Icon
        name={iconName}
        size="24"
        color={
          `${order === 'warning' ? 'surface' : order}-100` as IconProps['color']
        }
        isDecorative
      />
      <Box
        flex="1"
        justifyContent="start"
        className={cx('hds-alert-content', {
          'hds-mx-8': isDismissable,
          'hds-ml-8': !isDismissable,
        })}
      >
        {children}
      </Box>
      {isDismissable && (
        <IconButton
          className="hds-alert-icon-button"
          onClick={handleClick}
          size="32"
          aria-label="Close this alert"
        >
          <Icon name="Close" color="surface-100" size="24" isDecorative />
        </IconButton>
      )}
    </Box>
  )
})

export default Alert
