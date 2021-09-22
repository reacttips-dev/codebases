import React, { forwardRef, Ref } from 'react'
import cx from 'classnames'
import Box, { BoxProps } from '../Box'
import { Spacing } from '../../types'

export interface AdjacentProps extends BoxProps {
  /**
   * The spacing between adjacent elements
   */
  spacing?: Spacing
}

/**
 * Adjacents are a layout component to stack elements horizontally together
 */
const Adjacent = forwardRef(function Adjacent(
  props: AdjacentProps,
  ref: Ref<HTMLDivElement>
) {
  const { spacing, children, className, ...rest } = props

  return (
    <Box
      {...rest}
      ref={ref}
      className={cx('hds-adjacent', className)}
      flexDirection="row"
      spacing={spacing}
    >
      {children}
    </Box>
  )
})

export default Adjacent
