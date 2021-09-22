import React, { ReactNode, ElementType, forwardRef, Ref } from 'react'
import cx from 'classnames'
import { HTMLProps, Omit } from '../../helpers/omitType'
import { TextSize, TextColor, TextAlign } from './types'

export interface TextProps
  extends Omit<HTMLProps<HTMLElement>, 'size' | 'color'> {
  /**
   * Sets which size of our type scale to use.
   */
  size: TextSize
  /**
   * Sets the alignment of the Text.
   */
  align?: TextAlign
  /**
   * Sets the color of the Text.
   */
  color?: TextColor
  /**
   * Sets the underlying HTML element.
   */
  as?: ElementType
  /**
   * For styling.
   */
  className?: string
  /**
   * The content of the Text.
   */
  children: ReactNode
}

function getColor(color?: TextColor) {
  if (!color) {
    return undefined
  }
  const constants = ['white', 'black']
  if (constants.includes(color)) {
    return `constants-${color}`
  }
  return color
}

/**
 * Ensures all text content within an application adheres to our type scale.
 */
const Text = forwardRef(function Text(props: TextProps, ref: Ref<any>) {
  const { size, children, className, as = 'div', align, color, ...rest } = props
  const Tag = as

  return (
    <Tag
      {...rest}
      ref={ref}
      className={cx('hds-text', className, {
        [`hds-type-scale-${size}`]: size,
        'hds-type-scale-heading-92': true,
        [`hds-text-${align}`]: align,
        [`hds-text-${getColor(color)}`]: color,
      })}
    >
      {children}
    </Tag>
  )
})

Text.defaultProps = {
  as: 'div',
}

export default Text
