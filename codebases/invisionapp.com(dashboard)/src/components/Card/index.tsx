import React, { ElementType, forwardRef, Ref } from 'react'
import cx from 'classnames'
import { Omit, HTMLProps } from '../../helpers/omitType'
import { Spacing } from '../../types'
import Action from '../Action'

export interface CardProps
  extends Omit<HTMLProps<HTMLAnchorElement | HTMLButtonElement>, 'size'> {
  /**
   * The amount of padding to add around the Card.
   */
  padding?: Spacing
  /**
   * The HTML element to render.
   */
  as?: ElementType
}

/**
 * Cards are actionable components containing information about a single subject.
 */
const Card = forwardRef(function Card(
  props: CardProps,
  ref: Ref<HTMLAnchorElement | HTMLButtonElement>
) {
  const { className, children, padding, as = 'button', style, ...rest } = props
  const innerStyle = padding
    ? {
        padding: `var(--hds-spacing-${padding})`,
      }
    : {}
  return (
    <Action
      {...rest}
      ref={ref}
      className={cx('hds-card hds-transition-on-hover', className)}
      as={as}
      style={{
        ...innerStyle,
        ...style,
      }}
    >
      {children}
    </Action>
  )
})

Card.defaultProps = {
  as: 'button',
  padding: '16',
}

export default Card
