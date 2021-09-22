import React, { forwardRef, Ref } from 'react'
import cx from 'classnames'
import { HTMLProps } from '../../helpers/omitType'
import { BadgeOrder } from './types'

export interface BadgeProps extends HTMLProps<HTMLDivElement> {
  /**
   * If true, will render smaller.
   */
  isCompact?: boolean
  /**
   * Will visually style the badge differently to the regular.
   */
  order?: BadgeOrder
}

/**
 * Badges are compact elements for displaying terse, or simple, additional information.
 */
const Badge = forwardRef(function Badge(
  props: BadgeProps,
  ref: Ref<HTMLDivElement>
) {
  const { className, isCompact, children, order, ...rest } = props
  return (
    <div
      {...rest}
      ref={ref}
      className={cx('hds-badge', className, {
        [`hds-badge-is-compact`]: isCompact,
        'hds-badge-alpha': order === 'alpha',
        'hds-badge-beta': order === 'beta',
      })}
    >
      {children}
    </div>
  )
})

export default Badge
