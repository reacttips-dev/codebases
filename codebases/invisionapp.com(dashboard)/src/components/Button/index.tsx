import React, { ReactNode, ElementType, forwardRef, Ref } from 'react'
import cx from 'classnames'
import useFocusVisibleWithProps from '../../hooks/useFocusVisibleWithProps'
import { Omit, HTMLProps } from '../../helpers/omitType'
import Text from '../../primitives/Text'
import { TextSize } from '../../primitives/Text/types'
import { ButtonOrder, ButtonType } from './types'
import { Size } from '../../types'

export interface ButtonProps
  extends Omit<
    HTMLProps<HTMLButtonElement | HTMLAnchorElement>,
    'color' | 'size'
  > {
  /**
   * Changes the visual styling of the Button.
   */
  order: ButtonOrder
  /**
   * How big the Button will be
   */
  size?: Size
  /**
   * Correlated to the underlying HTML attribute.
   */
  type: ButtonType
  /**
   * The DOM element the Button will be rendered as.
   */
  as?: ElementType
  /**
   * The content of the Button
   */
  children: ReactNode
}

function getTextSize(size: Size): TextSize {
  if (size === '48' || size === '40') {
    return 'body-16'
  }
  return 'body-14'
}

/**
 * Buttons are our primary trigger for actions. Buttons carry a lot of visual weight,
 * so they should be reserved sparingly for actions like submitting a form or completing
 * a task. Never use them for navigation
 */
const Button = forwardRef(function Button(
  props: ButtonProps,
  ref: Ref<HTMLButtonElement | HTMLAnchorElement>
) {
  const {
    type,
    children,
    size = '32',
    order,
    as = 'button',
    className,
    ...rest
  } = props
  const { focusVisible, onFocus, onBlur } = useFocusVisibleWithProps(props)
  return (
    <Text
      {...rest}
      ref={ref}
      onBlur={onBlur}
      onFocus={onFocus}
      as={as}
      size={getTextSize(size)}
      type={type}
      className={cx('hds-button hds-transition-on-hover', className, {
        [`hds-button-${order}`]: order,
        [`hds-h-${size}`]: size,
        'hds-px-12': size === '24',
        'hds-px-16': size === '32',
        'hds-px-24': size === '40',
        'hds-px-32': size === '48',
        'hds-focus-visible': focusVisible,
      })}
    >
      {children}
    </Text>
  )
})

Button.defaultProps = {
  size: '32',
  as: 'button',
}

export default Button
