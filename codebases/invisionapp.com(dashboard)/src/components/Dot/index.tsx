import React, { forwardRef, Ref } from 'react'
import cx from 'classnames'
import { HTMLProps } from '../../helpers/omitType'

export interface DotProps extends HTMLProps<HTMLDivElement> {
  /**
   * The contents of the Dot
   */
  children: string
}

/**
 * Dots are used to indicate a number of unread notifications.
 */
const Dot = forwardRef(function Dot(props: DotProps, ref: Ref<HTMLDivElement>) {
  const { className, children, ...rest } = props
  return (
    <div {...rest} ref={ref} className={cx('hds-dot', className)}>
      {children}
    </div>
  )
})

export default Dot
