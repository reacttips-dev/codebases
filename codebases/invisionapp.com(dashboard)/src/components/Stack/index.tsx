import React, { forwardRef, Ref } from 'react'
import cx from 'classnames'
import Box from '../Box'
import { HTMLProps } from '../../helpers/omitType'
import { Spacing } from '../../types'

export interface StackProps extends HTMLProps<HTMLDivElement> {
  /**
   * The spacing between stacked elements
   */
  spacing?: Spacing
}

/**
 * Stacks are layout components which stack elements vertically together.
 */
const Stack = forwardRef(function Stack(
  props: StackProps,
  ref: Ref<HTMLDivElement>
) {
  const { spacing, children, className, ...rest } = props

  return (
    <Box
      {...rest}
      ref={ref}
      className={cx('hds-stack', className)}
      alignItems="stretch"
      flexDirection="col"
      spacing={spacing}
    >
      {children}
    </Box>
  )
})

export default Stack
