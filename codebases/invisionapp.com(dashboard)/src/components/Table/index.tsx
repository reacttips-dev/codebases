import React, { forwardRef, Ref, useMemo, useState } from 'react'
import cx from 'classnames'
import { Omit, HTMLProps } from '../../helpers/omitType'
import { Rows, Columns } from './types'
import Checkbox from '../Checkbox'
import Icon from '../../primitives/Icon'

export interface TableProps extends Omit<HTMLProps<HTMLTableElement>, 'rows'> {
  /**
   * The columns that make up the table.
   */
  columns: Columns
  /**
   * The data to populate the table with
   */
  rows: Rows
  /**
   * If true, each row will be selectable.
   */
  isSelectable?: boolean
}

/**
 * Tables display complex or large data sets in an easy-to-digest manner. Examples include user data or the props of a component.
 */
const Table = forwardRef(function Table(
  props: TableProps,
  ref: Ref<HTMLTableElement>
) {
  const { className, columns, rows, isSelectable, ...rest } = props

  const [currentlySorted, setCurrentlySorted] = useState<string>()
  const [sortedDirection, setSortedDirection] = useState<string>('none')
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([])

  const sortedRows = useMemo(() => {
    if (!currentlySorted) {
      return rows
    }
    const newRows = [...rows]
    if (newRows[0][currentlySorted]) {
      if (
        typeof newRows[0][currentlySorted] === 'string' ||
        typeof newRows[0][currentlySorted] === 'number'
      ) {
        if (sortedDirection === 'asc') {
          newRows.sort((a, b) =>
            a[currentlySorted] > b[currentlySorted] ? 1 : -1
          )
        } else if (sortedDirection === 'desc') {
          newRows.sort((a, b) =>
            a[currentlySorted] < b[currentlySorted] ? 1 : -1
          )
        }
      }
    }
    return newRows
  }, [rows, currentlySorted, sortedDirection])

  const checkAllId = useMemo(() => {
    return Math.random()
      .toString(36)
      .slice(-6)
  }, [])

  const handleHeaderClick = (id: string) => () => {
    setCurrentlySorted(id)
    if (sortedDirection === 'asc') {
      setSortedDirection('desc')
    } else if (sortedDirection === 'desc') {
      setSortedDirection('none')
    } else {
      setSortedDirection('asc')
    }
  }

  const hasSelectedAll = selectedRowIds.length === rows.length

  const handleCheckAll = () => {
    if (hasSelectedAll) {
      setSelectedRowIds([])
    } else {
      setSelectedRowIds(rows.map(row => row.rowId))
    }
  }

  const handleCheckRow = (rowId: string) => () => {
    if (selectedRowIds.includes(rowId)) {
      setSelectedRowIds(selectedRowIds.filter(id => id !== rowId))
    } else {
      setSelectedRowIds([...selectedRowIds, rowId])
    }
  }

  return (
    <table
      {...rest}
      ref={ref}
      className={cx('hds-table', className)}
      role="table"
    >
      <thead>
        <tr>
          {isSelectable && (
            <th role="columnheader" className="hds-table-header">
              <Checkbox
                withHiddenLabel
                label="Select all"
                id={checkAllId}
                onChange={handleCheckAll}
                checked={hasSelectedAll}
              />
            </th>
          )}
          {columns.map(column => {
            return (
              <th
                key={column.id}
                role="columnheader"
                className={cx('hds-table-header', {
                  'hds-table-header-is-sortable': column.isSortable,
                  [`hds-text-${column.align}`]: column.align,
                })}
                onClick={
                  column.isSortable ? handleHeaderClick(column.id) : undefined
                }
              >
                {column.title}
                {currentlySorted === column.id && sortedDirection !== 'none' && (
                  <Icon
                    name="Up"
                    size="16"
                    color="surface-100"
                    className={cx('hds-table-icon', {
                      'hds-table-icon-desc': sortedDirection === 'desc',
                    })}
                  />
                )}
              </th>
            )
          })}
        </tr>
      </thead>
      <tbody>
        {sortedRows.map((row, i) => {
          return (
            <tr
              key={row.data ? row.rowId : i}
              className={cx('hds-table-row', {
                'hds-table-row-is-selected':
                  isSelectable && selectedRowIds.includes(row.rowId),
              })}
            >
              {isSelectable && (
                <td role="cell" className="hds-table-header">
                  <Checkbox
                    withHiddenLabel
                    label="Select row"
                    id={`select-row-${row.rowId}`}
                    onChange={handleCheckRow(row.rowId)}
                    checked={selectedRowIds.includes(row.rowId)}
                  />
                </td>
              )}
              {columns.map(column => {
                return (
                  <td key={column.id} role="cell" className="hds-table-cell">
                    {row[column.id]}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
})

export default Table
