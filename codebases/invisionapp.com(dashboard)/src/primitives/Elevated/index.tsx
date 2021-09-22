import React, { forwardRef, Ref } from 'react'
import cx from 'classnames'
import { HTMLProps } from '../../helpers/omitType'
import { ElevatedOrder } from './types'
import Primitive from '../../helpers/Primitive'

export interface ElevatedProps extends HTMLProps<HTMLElement> {
  /**
   * The level of elevation to apply.
   */
  order: ElevatedOrder
}

/**
 * Elevation is not an aesthetic choice, but is specifically used to signify relationships between objects.
 */
const Elevated = forwardRef(function Elevated(
  props: ElevatedProps,
  ref: Ref<any>
) {
  const { order, children, className, ...rest } = props
  return (
    <Primitive
      {...rest}
      ref={ref}
      className={cx('hds-elevated', className, {
        [`hds-shadow-${order}`]: order !== 'default',
        'hds-shadow': order === 'default',
      })}
    >
      {children}
    </Primitive>
  )
})

export default Elevated
