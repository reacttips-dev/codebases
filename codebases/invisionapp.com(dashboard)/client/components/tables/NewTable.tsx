import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { MenuItem } from '@invisionapp/helios/components/Menu'
import { Flex, Tooltip, Checkbox } from '@invisionapp/helios'

import GeneralChangesDropdown from './GeneralChangesDropdown'
import { selectHasBulkItems } from '../../stores/bulkItems'
import { selectPermission } from '../../stores/permissions'
import { AppState } from '../../stores/index'
import Permission from '../Permission'

type NewTableProps = {
  columns: Column[]
  hideHeaders?: boolean
  loading?: boolean
  loadingRowCount?: number
  rows: Row[]
  selectable?: boolean
}

type ColumnId = string
type CellContent = any

type Column = {
  id: ColumnId
  title?: CellContent
  align?: 'left' | 'center' | 'right'
  width?: string
  renderWhenLoading?: any
}

type Row = {
  id: string
  rowProps?: Record<string, any>
  columns: Record<ColumnId, CellContent>
  showRowMenu?: boolean
  editRowMenuItems: MenuItem[]
  selectionDisabledMessage?: string
  selected?: boolean
  onSelectedChange?: (isSelected: boolean) => void
}

export const NewTable = (props: NewTableProps) => {
  const {
    columns,
    hideHeaders = false,
    loading = false,
    loadingRowCount = 3,
    rows,
    selectable = false
  } = props

  const hasBulkItems = useSelector(selectHasBulkItems)
  // Can make any changes to team members (promotions, demotions, removals, etc...)
  const canManageTeam = useSelector((state: AppState) =>
    selectPermission(state, 'People.ManageTeam')
  )

  const [focusedRowId, setFocusedRowId] = useState<string | undefined>()

  const renderHeaders = () => {
    if (rows.length === 0 && hideHeaders) {
      return null
    }
    return columns.map(column => {
      return (
        <StyledTh
          align={column.align ?? 'left'}
          id={`${column.id}-heading`}
          key={`${column.id}-heading`}
          style={{
            width: column.width ?? 'auto',
            paddingTop: '24px'
          }}
          loading={loading.toString()}
        >
          {column.title}
        </StyledTh>
      )
    })
  }

  const renderSelectableRowCheckbox = (row: Row) => {
    // this specific checkbox works with onClick and not onChange. That's why it's defined readOnly.
    return (
      <Permission for="People.BulkEdit">
        <SelectableCheckboxWrapper visible={focusedRowId === row.id || hasBulkItems}>
          <Tooltip
            trigger={
              <Checkbox
                id={`${row.id}-selector`}
                className="checkbox"
                checked={row.selected}
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()

                  row.onSelectedChange?.(!row.selected)
                }}
                unstyled
                disabled={!!row.selectionDisabledMessage}
                readOnly
              />
            }
            disabled={!row.selectionDisabledMessage}
            placement="top"
            chevron="start"
            offset={{
              x: -6
            }}
          >
            {row.selectionDisabledMessage}
          </Tooltip>
        </SelectableCheckboxWrapper>
      </Permission>
    )
  }

  const renderRow = (row: Row) => {
    return columns.map((column, index) => {
      const isFirstColumn = index === 0
      // check permission && flag && if it's the last column
      const isMenuVisible = canManageTeam && row.showRowMenu && columns.length - 1 === index
      const isActive = focusedRowId === row.id

      return (
        <StyledTd
          role="cell"
          align={column.align ?? 'left'}
          key={`${column.id}-row-column`}
          className={`${column.id}-row-column ${isActive ? 'isActive' : ''}`}
        >
          {selectable && isFirstColumn && renderSelectableRowCheckbox(row)}
          <Flex alignItems="center">
            {row.columns[column.id]}
            {isMenuVisible && (
              <GeneralChangesDropdown visible={isActive} items={row.editRowMenuItems} />
            )}
          </Flex>
        </StyledTd>
      )
    })
  }

  const renderLoading = () => {
    const loadingColumns = columns.map(column => {
      return (
        <StyledTd
          key={`${column.id}-heading-loading`}
          align={column.align ?? 'left'}
          id={`${column.id}-heading-loading`}
          style={{
            width: column.width ?? 'auto'
          }}
        >
          {column.renderWhenLoading}
        </StyledTd>
      )
    })

    return Array.from(new Array(loadingRowCount)).map((_, index) => (
      <StyledTr key={index.toString()}>{loadingColumns}</StyledTr>
    ))
  }

  const renderRows = () => {
    return rows.map(row => {
      return (
        <StyledTr
          role="row"
          key={`${row.id}-row`}
          {...row.rowProps}
          selected={!!row.selected}
          actionable={!row.selectionDisabledMessage && hasBulkItems}
          actionDisabled={!!row.selectionDisabledMessage && hasBulkItems}
          onMouseEnter={() => setFocusedRowId(row.id)}
          onMouseLeave={() => setFocusedRowId(undefined)}
          onClick={() => {
            if (!row.selectionDisabledMessage && hasBulkItems) {
              row.onSelectedChange?.(!row.selected)
            }
          }}
        >
          {renderRow(row)}
        </StyledTr>
      )
    })
  }

  return (
    <StyledTable role="table">
      <thead>
        <tr>{renderHeaders()}</tr>
      </thead>
      <tbody>{loading ? renderLoading() : renderRows()}</tbody>
    </StyledTable>
  )
}

const StyledTable = styled.table`
  width: 100%;
  background: none;
  border-collapse: collapse;
  border-spacing: 0;
  overflow-anchor: none;
`

type StyledTrProps = {
  selected?: boolean
  actionable?: boolean
  actionDisabled?: boolean
}
const StyledTr = styled.tr<StyledTrProps>`
  position: relative;
  background-color: ${props =>
    props.selected ? 'rgba(54, 61, 238, 0.1) !important' : 'none'};
  transition: background-color 90ms linear;

  &:hover {
    background-color: ${props => props.theme.palette.structure.lighter};
  }

  &:hover {
    ${props =>
      props.actionable
        ? `
            background-color: background-color: rgba(54, 61, 238, 0.1);
            cursor: pointer;
          `
        : ''}

    ${props => (props.actionDisabled ? 'cursor: not-allowed;' : '')}
  }
`

// loading should be a string, otherwise React is gonna show a type warning
type StyledThProps = { loading?: string; theme: any; align: string }
const StyledTh = styled.th<StyledThProps>`
  padding: ${(props: StyledThProps) => props.theme.spacing.m}
    ${(props: StyledThProps) => props.theme.spacing.s};
  border-bottom: 1px solid ${(props: StyledThProps) => props.theme.palette.structure.regular};
  color: ${(props: StyledThProps) => props.theme.palette.text.lighter};
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.25px;
  line-height: 16px;
  opacity: ${(props: StyledThProps) => (props.loading === 'true' ? 0.2 : '1')};
  pointer-events: ${(props: StyledThProps) => (props.loading === 'true' ? 'none' : 'auto')};
  text-align: ${(props: StyledThProps) => props.align};
`

const StyledTd = styled.td`
  position: relative;
  padding: ${props => props.theme.spacing.m} ${props => props.theme.spacing.s};
  border-top: 1px solid ${props => props.theme.palette.structure.regular};
  border-bottom: 1px solid ${props => props.theme.palette.structure.regular};
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 0.125px;
  line-height: 16px;
  text-align: ${props => props.align};
`

const SelectableCheckboxWrapper = styled.div<{ visible: boolean }>`
  position: absolute;
  z-index: ${props => props.theme.zindex.base};
  top: 50%;
  left: -51px;
  width: 50px;
  height: 40px;
  padding: 10px;
  opacity: 1;
  transform: translateY(-50%);
  transition: all 150ms linear;

  ${({ visible }) => {
    if (visible) {
      return `
        opacity: 1;
        left: -51px;
      `
    }
    return `
      opacity: 0;
      left: -41px;
    `
  }};
`
