import React, { forwardRef, Ref } from 'react'
import cx from 'classnames'
import { Omit, HTMLProps } from '../../helpers/omitType'
import {
  GridOrder,
  GridTemplateColumns,
  GridColumnSpan,
  GridTemplateRows,
  GridRowSpan,
  GridAutoFlow,
} from './types'
import { Spacing } from '../../types'

export interface GridProps extends Omit<HTMLProps<HTMLDivElement>, 'rowSpan'> {
  /**
   * Most times this will be set to `"wrapper"`. Only use `"cell"` as a direct child of a Grid when you need to use the `ColumnSpan` or `RowSpan` props to manually alter a single column/row.
   */
  order: GridOrder
  /**
   * How many columns the Grid will have on the xs breakpoint. Used with `order="wrapper"`.
   */
  xsColumns?: GridTemplateColumns
  /**
   * How many columns the Grid will have on the sm breakpoint. Used with `order="wrapper"`.
   */
  smColumns?: GridTemplateColumns
  /**
   * How many columns the Grid will have on the md breakpoint. Used with `order="wrapper"`.
   */
  mdColumns?: GridTemplateColumns
  /**
   * How many columns the Grid will have on the lg breakpoint. Used with `order="wrapper"`.
   */
  lgColumns?: GridTemplateColumns
  /**
   * How many columns the Grid will have on the xl breakpoint. Used with `order="wrapper"`.
   */
  xlColumns?: GridTemplateColumns
  /**
   * How many columns the cell should span. Used with `order="cell"`.
   */
  columnSpan?: GridColumnSpan
  /**
   * Hows many rows the Grid will have on the xs breakpoint. Used with `order="wrapper"`.
   */
  xsRows?: GridTemplateRows
  /**
   * Hows many rows the Grid will have on the xs breakpoint. Used with `order="wrapper"`.
   */
  smRows?: GridTemplateRows
  /**
   * Hows many rows the Grid will have on the xs breakpoint. Used with `order="wrapper"`.
   */
  mdRows?: GridTemplateRows
  /**
   * Hows many rows the Grid will have on the xs breakpoint. Used with `order="wrapper"`.
   */
  lgRows?: GridTemplateRows
  /**
   * Hows many rows the Grid will have on the xs breakpoint. Used with `order="wrapper"`.
   */
  xlRows?: GridTemplateRows
  /**
   * How many rows the cell should span. Used with `order="cell"`.
   */
  rowSpan?: GridRowSpan
  /**
   * The gap between each cell. Used with `order="cell"`.
   */
  gap?: Spacing
  /**
   * The direction the grid should take. The responsive column props will only work when this prop
   * is set to `"row"`/`"row-dense"`, and the responsive row props will only work when this prop is
   * set to `"col"`/`"col-dense"`.
   */
  autoFlow?: GridAutoFlow
}

function getClasses({
  xsColumns,
  smColumns,
  mdColumns,
  lgColumns,
  xlColumns,
  columnSpan,
  xsRows,
  smRows,
  mdRows,
  lgRows,
  xlRows,
  rowSpan,
  gap,
  autoFlow,
  order,
  className,
}: GridProps) {
  return cx(className, {
    'hds-grid-wrapper hds-grid': order === 'wrapper',
    'hds-grid-cell': order === 'cell',
    [`hds-grid-cols-${xsColumns}`]: xsColumns,
    [`sm:hds-grid-cols-${smColumns}`]: smColumns,
    [`md:hds-grid-cols-${mdColumns}`]: mdColumns,
    [`lg:hds-grid-cols-${lgColumns}`]: lgColumns,
    [`xl:hds-grid-cols-${xlColumns}`]: xlColumns,
    [`hds-col-${columnSpan}`]: columnSpan,
    [`hds-grid-rows-${xsRows}`]: xsRows,
    [`sm:hds-grid-rows-${smRows}`]: smRows,
    [`md:hds-grid-rows-${mdRows}`]: mdRows,
    [`lg:hds-grid-rows-${lgRows}`]: lgRows,
    [`xl:hds-grid-rows-${xlRows}`]: xlRows,
    [`hds-row-${rowSpan}`]: rowSpan,
    [`hds-gap-${gap}`]: gap,
    [`hds-grid-flow-${autoFlow}`]: autoFlow,
  })
}

/**
 * Grids are repsonsive layout helper components which can adapt to screen size to create flexible consistent layouts.
 */
const Grid = forwardRef(function Grid(
  props: GridProps,
  ref: Ref<HTMLDivElement>
) {
  const {
    children,
    xsColumns,
    smColumns,
    mdColumns,
    lgColumns,
    xlColumns,
    columnSpan,
    xsRows,
    smRows,
    mdRows,
    lgRows,
    xlRows,
    rowSpan,
    gap,
    autoFlow,
    order,
    className,
    ...rest
  } = props
  return (
    <div {...rest} ref={ref} className={getClasses(props)}>
      {children}
    </div>
  )
})

export default Grid
