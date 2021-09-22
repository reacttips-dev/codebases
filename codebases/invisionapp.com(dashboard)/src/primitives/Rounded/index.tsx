import React, { forwardRef, Ref } from 'react'
import cx from 'classnames'
import { HTMLProps } from '../../helpers/omitType'
import { RoundedOrder } from './types'
import Primitive from '../../helpers/Primitive'

export interface RoundedProps extends HTMLProps<HTMLElement> {
  /**
   * The amount of border-radius to add.
   */
  order: RoundedOrder
}

/**
 * Rounds the corners of a component.
 */
const Rounded = forwardRef(function Rounded(
  props: RoundedProps,
  ref: Ref<any>
) {
  const { order, children, className, ...rest } = props
  return (
    <Primitive
      {...rest}
      ref={ref}
      className={cx('hds-rounded', className, {
        [`hds-radii-${order}`]: order !== 'default',
        'hds-radii': order === 'default',
      })}
    >
      {children}
    </Primitive>
  )
})

export default Rounded
