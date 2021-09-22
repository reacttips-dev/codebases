import React, { forwardRef, Ref } from 'react'
import cx from 'classnames'
import { HTMLProps } from '../../helpers/omitType'
import { Spacing } from '../../types'
import Primitive from '../../helpers/Primitive'
import useSpacing from '../../hooks/useSpacing'

export interface PaddedProps extends HTMLProps<HTMLElement> {
  /**
   * Adds the specified padding level to all sides.
   */
  all?: Spacing
  /**
   * Adds the specified padding level to the left.
   */
  left?: Spacing
  /**
   * Adds the specified padding level to the right.
   */
  right?: Spacing
  /**
   * Adds the specified padding level to the top.
   */
  top?: Spacing
  /**
   * Adds the specified padding level to the bottom.
   */
  bottom?: Spacing
  /**
   * Adds the specified padding level to the left and right.
   */
  x?: Spacing
  /**
   * Adds the specified padding level to the top and bottom.
   */
  y?: Spacing
}

/**
 * Compounding increments used to add padding to components.
 */
const Padded = forwardRef(function Padded(props: PaddedProps, ref: Ref<any>) {
  const {
    all,
    left,
    right,
    top,
    bottom,
    x,
    y,
    children,
    className,
    style,
    ...rest
  } = props

  const spacing = useSpacing({
    all,
    x,
    y,
    top,
    right,
    bottom,
    left,
    type: 'padding',
  })

  return (
    <Primitive
      {...rest}
      ref={ref}
      className={cx('hds-padded', className)}
      style={{
        ...spacing,
        ...style,
      }}
    >
      {children}
    </Primitive>
  )
})

export default Padded
