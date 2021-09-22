import React, { forwardRef, Ref } from 'react'
import cx from 'classnames'
import { Omit, HTMLProps } from '../../helpers/omitType'
import Primitive from '../../helpers/Primitive'
import { PaletteColor } from './types'

export interface PaletteProps extends Omit<HTMLProps<HTMLElement>, 'color'> {
  /**
   * The color from our palette to use.
   */
  color: PaletteColor
}

/**
 * Adds a specific palette color as a background-color.
 */
const Palette = forwardRef(function Palette(
  props: PaletteProps,
  ref: Ref<any>
) {
  const { color, children, className, style, ...rest } = props

  const palette = {
    backgroundColor: `var(--hds-palette-${color})`,
  }

  return (
    <Primitive
      {...rest}
      ref={ref}
      className={cx('hds-palette', className)}
      style={{
        ...palette,
        ...style,
      }}
    >
      {children}
    </Primitive>
  )
})

export default Palette
