import React, { ReactNode, forwardRef, Ref } from 'react'
import cx from 'classnames'
import { Omit, HTMLProps } from '../../helpers/omitType'
import { ToolbarOrientation, ToolbarSize } from './types'
import Box from '../Box'

export interface ToolbarProps extends Omit<HTMLProps<HTMLDivElement>, 'size'> {
  /**
   * The display direction of the Toolbar.
   */
  orientation: ToolbarOrientation
  /**
   * The content of the Toolbar Item. Will usually be a single IconButton,
   * although the Toolbar does support more complex structures, for example
   * a hidden Dropdown, or a Zoom component.
   */
  items: ReactNode[]
  /**
   * Sets the width of a vertical Toolbar, or the height of a horizontal Toolbar.
   */
  size?: ToolbarSize
}

/**
 * Toolbars house contextually-appropriate actionable navigation items.
 */
const Toolbar = forwardRef(function Toolbar(
  props: ToolbarProps,
  ref: Ref<HTMLDivElement>
) {
  const { orientation, className, items, size, ...rest } = props
  return (
    <div
      {...rest}
      ref={ref}
      className={cx('hds-toolbar', className, {
        'hds-toolbar-horizontal': orientation === 'horizontal',
        'hds-toolbar-vertical': orientation === 'vertical',
        [`hds-w-${size}`]: orientation === 'vertical',
        [`hds-h-${size}`]: orientation === 'horizontal',
        [`hds-toolbar-${size}`]: size,
      })}
    >
      <Box
        alignItems="stretch"
        flexDirection={orientation === 'vertical' ? 'col' : 'row'}
        spacing="4"
      >
        {items.map((item, i) => {
          return (
            <div key={i} className="hds-toolbar-item">
              {item}
            </div>
          )
        })}
      </Box>
    </div>
  )
})

Toolbar.defaultProps = {
  size: '56',
}

export default Toolbar
