import React, { ReactNode, ElementType, forwardRef, Ref } from 'react'
import cx from 'classnames'
import Action from '../Action'
import { HTMLProps, Omit } from '../../helpers/omitType'
import { IconSize } from '../../types'

export interface IconButtonProps
  extends Omit<
    HTMLProps<HTMLButtonElement | HTMLAnchorElement>,
    'color' | 'size'
  > {
  /**
   * The content of the IconButton. Should be a Helios One icon.
   */
  children: ReactNode
  /**
   * The DOM element to render the IconButton as
   */
  as?: ElementType
  /**
   * The size of the IconButton. We would recommend using a 24px icon within
   * the IconButton for all sizes other than 24, in which case a 20px icon
   * would be recommended.
   */
  size?: IconSize
  /**
   * If true, displays the active state of the IconButton
   */
  isActive?: boolean
  /**
   * If true, the IconButton will be non-interactive
   */
  isDisabled?: boolean
}

/**
 * IconButtons are actionable icons.
 */
const IconButton = forwardRef(function IconButton(
  props: IconButtonProps,
  ref: Ref<HTMLButtonElement | HTMLAnchorElement>
) {
  const {
    as = 'button',
    children,
    className,
    size,
    isActive,
    isDisabled,
    ...rest
  } = props
  return (
    <Action
      {...rest}
      as={as}
      ref={ref}
      className={cx(
        'hds-icon-button hds-transition-on-hover-before',
        className,
        {
          [`hds-h-${size} hds-w-${size}`]: size,
          'hds-icon-button-is-active': isActive,
        }
      )}
      disabled={isDisabled}
    >
      {children}
    </Action>
  )
})

IconButton.defaultProps = {
  size: '32',
  as: 'button',
}

export default IconButton
