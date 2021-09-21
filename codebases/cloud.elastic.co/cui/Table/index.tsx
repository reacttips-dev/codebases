/*
 * ELASTICSEARCH CONFIDENTIAL
 * __________________
 *
 *  Copyright Elasticsearch B.V. All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Elasticsearch B.V. and its suppliers, if any.
 * The intellectual and technical concepts contained herein
 * are proprietary to Elasticsearch B.V. and its suppliers and
 * may be covered by U.S. and Foreign Patents, patents in
 * process, and are protected by trade secret or copyright
 * law.  Dissemination of this information or reproduction of
 * this material is strictly forbidden unless prior written
 * permission is obtained from Elasticsearch B.V.
 */

import { range, isEmpty, orderBy, find, uniqueId, isObject, without } from 'lodash'
import classnames from 'classnames'

import React, { Component, Fragment, ReactNode, ReactElement, isValidElement, Key } from 'react'
import { FormattedMessage } from 'react-intl'

import {
  EuiButtonIcon,
  EuiCallOut,
  EuiCheckbox,
  EuiErrorBoundary,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormHelpText,
  EuiPagination,
  EuiSpacer,
  EuiTable,
  EuiTableBody,
  EuiTableFooter,
  EuiTableFooterCell,
  EuiTableHeader,
  EuiTableHeaderCell,
  EuiTableHeaderCellCheckbox,
  EuiTableHeaderMobile,
  EuiTableRow,
  EuiTableRowCell,
  EuiTableRowCellCheckbox,
  EuiTableSortMobile,
} from '@elastic/eui'

import { CuiSmallCallbackBoundary } from '../Boundary'

import DefaultEmptyTableMessage from './DefaultEmptyTableMessage'
import { CuiTableLoadingCell } from './TableLoadingCell'

import { Props, State, Column, VerticalAlignOptions } from './types'

import './cuiTable.scss'

export { CuiTableLoadingCell, CuiTableLoadingCellContent } from './TableLoadingCell'
export type { Column as CuiTableColumn } from './types'

const selectColumnId = `__select-row`
const getDefaultRowId = () => uniqueId(`table_row_`)
const getDefaultColumnId = () => uniqueId(`table_column_`)

export class CuiTable<Row = any> extends Component<Props<Row>, State<Row>> {
  static defaultProps: Partial<Props<any>> = {
    alwaysRenderCustomRows: true,
    compressed: false,
    getRowId: getDefaultRowId,
    defaultPage: 0,
    pageSize: Infinity,
    emptyMessage: <DefaultEmptyTableMessage />,
    hasHeaderRow: true,
    initialSort: null,
    initialSortDirection: `asc`,
  }

  state: State<Row> = {
    expandedRowIds: [],
    page: this.props.defaultPage!,
    sortColumn: this.props.initialSort!,
    sortDirection: this.props.initialSortDirection!,
  }

  componentDidMount() {
    this.invalidatePropsGuard(this.props)
  }

  componentDidUpdate() {
    this.invalidatePropsGuard(this.props)
  }

  render() {
    return <EuiErrorBoundary>{this.renderTable()}</EuiErrorBoundary>
  }

  renderTable() {
    const { className, compressed, fullWidth, ['data-test-id']: dataTestSubj } = this.props

    const containerClasses = classnames({ fullWidth })

    return (
      <div className={containerClasses} data-test-id={dataTestSubj}>
        {this.renderTableSortMobileMenu()}

        <EuiTable compressed={compressed} className={className}>
          {this.renderTableHeader()}
          {this.renderTableBody()}
          {this.renderTableFooter()}
        </EuiTable>

        {this.renderTablePagination()}
      </div>
    )
  }

  renderTableSortMobileMenu() {
    const mobileSort = this.getMobileSortItems()

    return (
      <EuiTableHeaderMobile>
        <EuiFlexGroup responsive={false} justifyContent='spaceBetween' alignItems='baseline'>
          <EuiFlexItem grow={false}>{this.renderSelectAllRows({ mobileHeader: true })}</EuiFlexItem>
          <EuiFlexItem grow={false}>
            {mobileSort !== null && <EuiTableSortMobile items={mobileSort} />}
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiTableHeaderMobile>
    )
  }

  renderTableHeader() {
    const { hasHeaderRow } = this.props

    if (!hasHeaderRow) {
      return null
    }

    const columns = this.getColumns()

    return <EuiTableHeader>{columns.map(this.renderHeaderCell)}</EuiTableHeader>
  }

  renderTableBody() {
    const { alwaysRenderCustomRows, rows, renderCustomRowsFirst, renderCustomRowsLast } = this.props
    const { pageRows } = this.getPage()
    const initialLoading = this.isInitialLoading()

    if (initialLoading) {
      return this.renderLoadingState()
    }

    const mustRenderCustomRows =
      alwaysRenderCustomRows && (renderCustomRowsFirst || renderCustomRowsLast)

    if (isEmpty(rows) && !mustRenderCustomRows) {
      return this.renderEmptyState()
    }

    return (
      <EuiTableBody>
        {this.renderOutOfRangeSelectionRow()}
        {renderCustomRowsFirst && renderCustomRowsFirst()}
        {pageRows.map(this.renderRow)}
        {renderCustomRowsLast && renderCustomRowsLast()}
      </EuiTableBody>
    )
  }

  renderTableFooter() {
    const { hasFooterRow, columns, initialLoading } = this.props

    if (!hasFooterRow || initialLoading) {
      return null
    }

    return <EuiTableFooter>{columns.map(this.renderFooterCell)}</EuiTableFooter>
  }

  renderOutOfRangeSelectionRow() {
    const outOfRangeSelectedRows = this.getOutOfRangeSelectedRows()
    const amount = outOfRangeSelectedRows.length

    if (amount === 0) {
      return null
    }

    const columns = this.getColumns()
    const colSpan = columns.length

    return (
      <EuiTableRow>
        <EuiTableRowCell textOnly={false} colSpan={colSpan}>
          <div style={{ width: '100%' }}>
            <EuiCallOut
              color='warning'
              size='s'
              title={
                <FormattedMessage
                  id='cui-table.selection-out-of-range'
                  defaultMessage='Selection includes {amount, plural, one {a row that has} other {{amount} rows that have}} been filtered out.'
                  values={{ amount }}
                />
              }
            />
          </div>
        </EuiTableRowCell>
      </EuiTableRow>
    )
  }

  renderTablePagination() {
    const { showMatchCount } = this.props
    const { page, pageCount, pageRows, hasPagination } = this.getPage()

    if (!showMatchCount && !hasPagination) {
      return null
    }

    return (
      <Fragment>
        <EuiSpacer size='m' />

        <EuiFlexGroup alignItems='center' justifyContent='spaceBetween'>
          <EuiFlexItem grow={false}>
            {showMatchCount && (
              <EuiFormHelpText>
                {this.renderMatchSummary({ page, currentPageSize: pageRows.length })}
              </EuiFormHelpText>
            )}
          </EuiFlexItem>

          {hasPagination && (
            <EuiFlexItem grow={false}>
              <EuiPagination
                pageCount={pageCount}
                activePage={page}
                onPageClick={(nextPage) => this.setState({ page: nextPage })}
              />
            </EuiFlexItem>
          )}
        </EuiFlexGroup>
      </Fragment>
    )
  }

  renderLoadingState() {
    const { pageSize } = this.props
    const columns = this.getColumns()
    const colSpan = columns.length
    const rowCount = getLoadingStateRowCount()

    return (
      <EuiTableBody>
        {range(rowCount).map((rowIndex) => (
          <EuiTableRow key={`loading-state-row-${rowIndex}`}>
            {range(colSpan).map((colIndex) => (
              <CuiTableLoadingCell key={`loading-state-row-${rowIndex}-col-${colIndex}`} />
            ))}
          </EuiTableRow>
        ))}
      </EuiTableBody>
    )

    function getLoadingStateRowCount(): number {
      const DEFAULT_ROW_COUNT = 4

      if (isFinite(pageSize!)) {
        return Math.min(pageSize!, DEFAULT_ROW_COUNT)
      }

      return DEFAULT_ROW_COUNT
    }
  }

  renderEmptyState() {
    const { emptyMessage, isEmbeddedTable } = this.props
    const columns = this.getColumns()
    const colSpan = columns.length

    if (emptyMessage === null) {
      return null
    }

    const row = (
      <EuiTableRow isExpandedRow={isEmbeddedTable}>
        <EuiTableRowCell align='center' colSpan={colSpan} isMobileFullWidth={true}>
          <div data-test-id='cui-table-empty-message'>{emptyMessage}</div>
        </EuiTableRowCell>
      </EuiTableRow>
    )

    return <EuiTableBody>{row}</EuiTableBody>
  }

  renderMatchSummary({
    page,
    currentPageSize,
  }: {
    page: number
    currentPageSize: number
  }): ReactNode {
    if (!this.shouldRenderMatchSummary()) {
      return null
    }

    const { rows, pageSize, totalCount, matchType, matchTypePlural } = this.props
    const rowCount = rows!.length

    if (!isFinite(pageSize!) || rowCount <= pageSize!) {
      return (
        <FormattedMessage
          id='table.match-underflowed'
          defaultMessage='Showing { rowCount } matching {rowCount, plural, one {{matchType}} other {{matchTypePlural}}} out of a total of {totalCount} {totalCount, plural, one {{matchType}} other {{matchTypePlural}}}'
          values={{
            rowCount,
            totalCount,
            matchType,
            matchTypePlural,
          }}
        />
      )
    }

    if (rowCount === totalCount) {
      return (
        <FormattedMessage
          id='table.page-match-full'
          defaultMessage='Showing page { page } with { currentPageSize } of { rowCount } {rowCount, plural, one {{matchType}} other {{matchTypePlural}}}'
          values={{
            page: page + 1,
            currentPageSize,
            rowCount,
            matchType,
            matchTypePlural,
          }}
        />
      )
    }

    return (
      <FormattedMessage
        id='table.page-match-overflowed'
        defaultMessage='Showing page { page } with { currentPageSize } of { rowCount } matches out of a total of {totalCount} {totalCount, plural, one {{matchType}} other {{matchTypePlural}}}'
        values={{
          page: page + 1,
          currentPageSize,
          rowCount,
          totalCount,
          matchType,
          matchTypePlural,
        }}
      />
    )
  }

  renderHeaderCell = (column: Column<Row>): ReactNode => {
    const { sortColumn, sortDirection } = this.state
    const { header = {}, label, align, width } = column
    const { render, renderCell, className, verticalAlign } = header
    const key = this.getCellKey(column)

    if (typeof renderCell === `function`) {
      return <Fragment key={key}>{renderCell()}</Fragment>
    }

    const classes = this.getCellClasses({ className, verticalAlign })

    const cellContent = typeof render === `function` ? render() : label

    const mobileOptions = this.getMobileOptions({ column, row: null })

    const isSorted = sortColumn !== null && this.getCellKey(sortColumn) === key
    const canSort = Boolean(column.sortKey)
    const onSort = canSort ? () => this.onSort(column) : undefined

    return (
      // @ts-ignore: EUI is being weird about `width` props
      <EuiTableHeaderCell
        key={key}
        className={classes}
        width={width}
        align={align}
        isSortAscending={sortDirection === `asc`}
        isSorted={isSorted}
        onSort={onSort}
        mobileOptions={mobileOptions}
      >
        {cellContent}
      </EuiTableHeaderCell>
    )
  }

  renderFooterCell = (column: Column<Row>): ReactNode => {
    const { footer = {}, label, align, width } = column
    const { render, className, verticalAlign } = footer

    const cellContent = typeof render === `function` ? render() : label

    const key = this.getCellKey(column)
    const classes = this.getCellClasses({ className, verticalAlign })

    return (
      // @ts-ignore: EUI is being weird about `width` props
      <EuiTableFooterCell key={key} className={classes} width={width} align={align}>
        {cellContent}
      </EuiTableFooterCell>
    )
  }

  renderRow = (row: Row): ReactNode => {
    const { renderRow, isEmbeddedTable } = this.props
    const columns = this.getColumns()

    const id = this.getRowId(row)
    const className = this.getRowClasses(row)

    const cells = columns.map((column, columnIndex) => (
      <CuiSmallCallbackBoundary key={this.getCellKey(column)}>
        {() => this.renderCell({ column, columnIndex, row })}
      </CuiSmallCallbackBoundary>
    ))

    const baseRow = (
      // @ts-ignore: isExpandedRow is indeed in <EuiTableRow>
      <EuiTableRow
        key={`${id}-baseRow`}
        className={className}
        isExpandedRow={isEmbeddedTable}
        isSelected={this.isSelectedRow(row)}
        isSelectable={this.isSelectableRow(row)}
        data-test-id={this.getRowTestSubj(row)}
      >
        {cells}
      </EuiTableRow>
    )

    const detailRow = this.renderDetailRow({ row })

    if (typeof renderRow === `function`) {
      return renderRow({ id, children: cells, columns, row, className, baseRow, detailRow })
    }

    return (
      <Fragment key={id}>
        {baseRow}
        {detailRow}
      </Fragment>
    )
  }

  renderCell = ({
    column,
    columnIndex,
    row,
  }: {
    column: Column<Row>
    columnIndex: number
    row: Row
  }): ReactElement | null => {
    const {
      render,
      renderCell,
      className,
      textOnly,
      truncateText,
      align,
      width,
      actions,
      verticalAlign,
    } = column

    const isExpanded = this.hasExpandedDetails(row)

    const classes = this.getCellClasses({ className, verticalAlign, actions })

    const cellProps = {
      className: classes,
      textOnly,
      truncateText,
      align,
      width,
      showOnHover: actions ? true : undefined,
      mobileOptions: this.getMobileOptions({ column, row }),
    }

    const rowCellContent =
      typeof render === `function` ? render(row, { isExpanded }) : row[columnIndex]

    const expandButton = this.renderExpandDetailButton({ row })

    const children = (
      <Fragment>
        {actions ? (
          <EuiFlexGroup gutterSize='s' alignItems='center' responsive={false}>
            {rowCellContent && <EuiFlexItem grow={false}>{rowCellContent}</EuiFlexItem>}

            {expandButton && <EuiFlexItem grow={false}>{expandButton}</EuiFlexItem>}
          </EuiFlexGroup>
        ) : (
          rowCellContent
        )}
      </Fragment>
    )

    if (typeof renderCell === `function`) {
      return <Fragment>{renderCell(row, { isExpanded, cellProps, children })}</Fragment>
    }

    return <EuiTableRowCell {...cellProps}>{children}</EuiTableRowCell>
  }

  renderSelectAllRows({ mobileHeader }) {
    const selectable = this.isSelectable()

    if (selectable === false) {
      return null
    }

    return (
      <EuiCheckbox
        id={`${getDefaultRowId()}-select-all-rows`}
        disabled={!this.canSelectAllRows()}
        checked={this.canSelectAllRows() && this.hasSelectedAllSelectableRows()}
        onChange={this.toggleAllSelectableRowsSelected}
        type={mobileHeader ? undefined : `inList`}
        label={
          mobileHeader ? (
            <FormattedMessage id='table.select-all-rows' defaultMessage='Select all' />
          ) : null
        }
      />
    )
  }

  renderExpandDetailButton = ({ row }: { row: Row }): ReactNode => {
    const { detailButtonProps = {}, renderDetailButton, isDetailRowDisabled } = this.props
    const expandRowDetails = this.canExpandDetails(row)

    if (!expandRowDetails) {
      return null
    }

    if (renderDetailButton === false) {
      return null
    }

    const isExpanded = this.hasExpandedDetails(row)
    const disabled = typeof isDetailRowDisabled === `function` && isDetailRowDisabled(row)
    const toggleExpanded = () => this.toggleExpandedDetail(row)

    if (typeof renderDetailButton === `function`) {
      return renderDetailButton({ row, isExpanded, toggleExpanded })
    }

    return (
      <EuiButtonIcon
        aria-label={isExpanded ? `Collapse details` : `Expand details`}
        disabled={disabled}
        onClick={toggleExpanded}
        iconType={isExpanded ? `arrowUp` : `arrowDown`}
        {...detailButtonProps}
      />
    )
  }

  renderDetailRow({ row }) {
    const columns = this.getColumns()
    const detailRowContents = this.getDetailRowContents({ row })

    if (!detailRowContents) {
      return null
    }

    const id = this.getRowId(row)
    const className = this.getRowClasses(row)
    const mobileOptions = this.getMobileOptions({ column: null, row })

    const cellProps = {
      children: detailRowContents,
      columns,
      mobileOptions,
      textOnly: false,
    }

    return (
      // @ts-ignore: isExpandedRow is indeed in <EuiTableRow>
      <EuiTableRow key={`${id}-detailRow`} className={className} isExpandedRow={true}>
        {this.renderDetailRowCells(cellProps)}
      </EuiTableRow>
    )
  }

  renderDetailRowCells({ children, columns, ...cellProps }) {
    const parentColSpan = columns.length

    return (
      <EuiTableRowCell colSpan={parentColSpan} {...cellProps}>
        <div style={{ width: `100%` }}>{children}</div>
      </EuiTableRowCell>
    )
  }

  invalidatePropsGuard(props: Props<Row>): void {
    const requiresExplicitRowId = isDefinedProp([
      `renderDetailButton`,
      `detailButtonProps`,
      `hasDetailRow`,
      `hasExpandedDetailRow`,
      `renderDetailRow`,
      `selectedRows`,
      `onSelectionChange`,
    ])

    const noExplicitRowId = props.getRowId === getDefaultRowId

    if (requiresExplicitRowId && noExplicitRowId) {
      throw new Error(`<CuiTable> requires explicit getRowId prop, but none was defined.`)
    }

    function isDefinedProp(prop: string | string[]): boolean {
      if (Array.isArray(prop)) {
        return prop.some(isDefinedProp)
      }

      return typeof props[prop] !== `undefined`
    }
  }

  getRowClasses(row: Row): string | undefined {
    const { rowClass } = this.props

    if (typeof rowClass === `string`) {
      return rowClass
    }

    if (typeof rowClass === `function`) {
      return rowClass(row)
    }

    return undefined
  }

  getRowTestSubj(row: Row): string {
    const { getRowTestSubj } = this.props

    if (typeof getRowTestSubj === `function`) {
      return getRowTestSubj(row)
    }

    return `${this.getRowId(row).replace(/\W/g, ``)}-row`
  }

  getCellKey(column: Column<Row>): Key {
    const { key, id, label } = column

    if (key != null) {
      return key
    }

    if (typeof id === `string`) {
      return id
    }

    if (isValidElement(label)) {
      // @ts-ignore
      return label.props.id
    }

    if (typeof label === `string`) {
      return label
    }

    const mobileOptions = this.getMobileOptions({ column, row: null })

    if (mobileOptions && isValidElement(mobileOptions.label)) {
      // @ts-ignore
      return mobileOptions.label.props.id
    }

    if (typeof mobileOptions.label === `string`) {
      return mobileOptions.label
    }

    return getDefaultColumnId()
  }

  onSort = (column: Column<Row>) => {
    const { sortColumn, sortDirection } = this.state
    const key = sortColumn !== null && this.getCellKey(sortColumn)
    const nextKey = this.getCellKey(column)

    this.setState({
      sortColumn: column,
      sortDirection: getNextSortDirection(),
      expandedRowIds: [],
      page: 0,
    })

    function getNextSortDirection() {
      if (nextKey === key && sortDirection === `asc`) {
        return `desc`
      }

      return `asc`
    }
  }

  getMobileSortItems() {
    const { sortColumn, sortDirection } = this.state
    const columns = this.getColumns()
    const sortableColumns = columns.filter((column) => Boolean(column.sortKey))

    if (isEmpty(sortableColumns)) {
      return null
    }

    const isSortAscending = sortDirection === `asc`

    const sortColumnKey = sortColumn !== null && this.getCellKey(sortColumn)

    const sortableItems = sortableColumns.map((column) => {
      const key = this.getCellKey(column)
      const isSorted = sortColumnKey === key
      const mobileOptions = this.getMobileOptions({ column, row: null })

      return {
        key,
        name: mobileOptions.header,
        isSortAscending,
        isSorted,
        onSort: () => this.onSort(column),
      }
    })

    return sortableItems
  }

  getPage(): {
    page: number
    pageCount: number
    pageRows: Row[]
    hasPagination: boolean
  } {
    const { pageSize: rawPageSize, rows: rawRows } = this.props
    const { page: pageState, sortColumn, sortDirection } = this.state

    const rows = getSortedRows()
    const rowCount = rows.length

    const pageSize = rawPageSize!
    const pageCount = Math.ceil(rowCount / pageSize)

    const hasPagination = isFinite(pageSize) && rowCount > pageSize

    const page = Math.min(pageState, pageCount - 1)
    const pageStart = page * pageSize
    const pageEnd = pageStart + pageSize

    const pageRows = hasPagination ? rows.slice(pageStart, pageEnd) : rows

    return {
      page,
      pageCount,
      pageRows,
      hasPagination,
    }

    function getSortedRows(): Row[] {
      if (!Array.isArray(rawRows)) {
        return []
      }

      if (sortColumn === null) {
        return rawRows
      }

      return orderBy<Row>(rawRows, sortColumn.sortKey, sortDirection)
    }
  }

  getColumns(): Array<Column<Row>> {
    const { columns, disabled } = this.props
    const selectable = this.isSelectable()

    if (!selectable) {
      return columns
    }

    const selectColumn: Column<Row> = {
      id: selectColumnId,

      header: {
        renderCell: () => (
          <EuiTableHeaderCellCheckbox>
            {this.renderSelectAllRows({ mobileHeader: false })}
          </EuiTableHeaderCellCheckbox>
        ),
      },

      renderCell: (row: Row) => (
        <EuiTableRowCellCheckbox>
          <EuiCheckbox
            id={`${this.getRowId(row)}:select-row`}
            checked={this.isSelectedRow(row)}
            disabled={disabled || !this.isSelectableRow(row)}
            onChange={() => this.toggleRowSelected(row)}
            type='inList'
          />
        </EuiTableRowCellCheckbox>
      ),

      width: `24px`,
    }

    return [selectColumn, ...columns]
  }

  getCellClasses = ({
    className,
    verticalAlign,
    actions,
  }: {
    className?: string
    verticalAlign: VerticalAlignOptions
    actions?: boolean
  }): string =>
    classnames(className, {
      'cuiTable-verticalAlignTop': verticalAlign === `top`,
      cuiTableActionsCell: actions,
    })

  getMobileOptions = ({ column, row }: { column: Column<Row> | null; row: Row | null }) => {
    const { label, mobile } = getColumnOptions()
    const parsedMobile = parseMobileOptions(mobile)
    const header = parsedMobile.label || label

    const fullWidth = !column || column.id === selectColumnId || !column.actions

    const options: { [key: string]: any } = {
      header,
      fullWidth,
      truncateText: false,
      ...parsedMobile,
    }

    return options

    function getColumnOptions() {
      if (column === null) {
        return { label: null, mobile: {} }
      }

      return column
    }

    function parseMobileOptions(mobile): { [key: string]: any } {
      if (typeof mobile !== `function`) {
        return isObject(mobile) ? mobile : {}
      }

      if (row === null) {
        return {}
      }

      const dynMobile = mobile(row)

      return isObject(dynMobile) ? dynMobile : {}
    }
  }

  getRowId(row: Row): string {
    const { rows, getRowId } = this.props

    if (!Array.isArray(rows)) {
      return getDefaultRowId() // sanity
    }

    const id = getRowId!(row, rows.indexOf(row))

    // if the getRowId prop passed in doesn't resolve to a value, fall back to the default
    if (id == null) {
      return getDefaultRowId()
    }

    return id
  }

  getDetailRowContents({ row }: { row: Row }): ReactNode {
    const { isEmbeddedTable, renderDetailRow } = this.props

    if (isEmbeddedTable || !renderDetailRow) {
      return null
    }

    const expandRowDetails = this.canExpandDetails(row)

    if (!expandRowDetails) {
      return null
    }

    const isExpanded = this.hasExpandedDetails(row)

    if (!isExpanded) {
      return null
    }

    return renderDetailRow(row)
  }

  hasExpandedDetails = (row: Row): boolean => {
    const { hasExpandedDetailRow, isDetailRowDisabled } = this.props
    const { expandedRowIds } = this.state

    if (typeof isDetailRowDisabled === `function` && isDetailRowDisabled(row)) {
      return false
    }

    if (typeof hasExpandedDetailRow === `function`) {
      return hasExpandedDetailRow(row)
    }

    if (typeof hasExpandedDetailRow === `boolean`) {
      return hasExpandedDetailRow
    }

    const id = this.getRowId(row)
    const isExpanded = expandedRowIds.includes(id)

    return isExpanded
  }

  canExpandDetails = (row: Row): boolean => {
    const { hasDetailRow, renderDetailRow } = this.props

    if (!renderDetailRow) {
      return false
    }

    // it is, thus it can be
    if (this.hasExpandedDetails(row)) {
      return true
    }

    if (typeof hasDetailRow === `function`) {
      return hasDetailRow(row)
    }

    return Boolean(hasDetailRow)
  }

  toggleExpandedDetail = (row) => {
    const { expandedRowIds } = this.state
    const isExpanded = this.hasExpandedDetails(row)
    const id = this.getRowId(row)

    if (isExpanded) {
      const collapseRow = without(expandedRowIds, id)

      this.setState({ expandedRowIds: collapseRow })
    } else {
      const expandRow = [...expandedRowIds, id]

      this.setState({ expandedRowIds: expandRow })
    }
  }

  toggleRowSelected = (row: Row): void => {
    const { selectedRows = [], onSelectionChange } = this.props
    const selectedRow = this.getSelectedRow(row)

    const nextSelection = selectedRow ? without(selectedRows, selectedRow) : [...selectedRows, row]

    onSelectionChange!(nextSelection)
  }

  getSelectableRows = (): Row[] => {
    const { rows } = this.props

    if (!Array.isArray(rows)) {
      return []
    }

    const selectableRows = rows.filter(this.isSelectableRow)
    return selectableRows
  }

  canSelectAllRows = (): boolean => {
    const { disabled } = this.props
    const selectableRows = this.getSelectableRows()

    return !disabled && !isEmpty(selectableRows)
  }

  toggleAllSelectableRowsSelected = (): void => {
    const { onSelectionChange } = this.props
    const selectableRows = this.getSelectableRows()
    const selectedAllRows = this.hasSelectedAllSelectableRows()

    const nextSelection = selectedAllRows ? [] : [...selectableRows]

    onSelectionChange!(nextSelection)
  }

  getSelectedRow = (row: Row): Row | undefined => {
    const { selectedRows } = this.props
    const rowId = this.getRowId(row)

    const matchesRowId = (selectedRow: Row): boolean => {
      const selectedRowId = this.getRowId(selectedRow)
      return selectedRowId === rowId
    }

    return find(selectedRows, matchesRowId)
  }

  getOutOfRangeSelectedRows = (): Row[] => {
    const { selectedRows } = this.props

    if (!selectedRows) {
      return []
    }

    const { pageRows } = this.getPage()
    const pageRowIds = pageRows.map((row) => this.getRowId(row))

    const isOutOfRange = (selectedRow: Row): boolean => {
      const selectedRowId = this.getRowId(selectedRow)
      const rowIsOutOfRange = pageRowIds.includes(selectedRowId) === false
      return rowIsOutOfRange
    }

    const outOfRangeSelectedRows = selectedRows.filter(isOutOfRange)
    return outOfRangeSelectedRows
  }

  isSelectable = (): boolean => {
    const { selectedRows } = this.props
    return Array.isArray(selectedRows)
  }

  isSelectableRow = (row: Row): boolean => {
    const { isSelectableRow } = this.props

    const selectable = this.isSelectable()

    if (selectable === false) {
      return false
    }

    if (typeof isSelectableRow === `function`) {
      return isSelectableRow(row)
    }

    return true
  }

  isSelectedRow = (row: Row): boolean => Boolean(this.getSelectedRow(row))

  hasSelectedAllSelectableRows = (): boolean => {
    const selectableRows = this.getSelectableRows()
    const selectedAllSelectableRows = selectableRows.every(this.isSelectedRow)
    return selectedAllSelectableRows
  }

  hasSelectedAnyRows = (): boolean => {
    const { rows } = this.props

    if (!Array.isArray(rows)) {
      return false
    }

    const selectedAnyRow = rows.some(this.isSelectedRow)
    return selectedAnyRow
  }

  isInitialLoading(): boolean {
    const { initialLoading, rows } = this.props

    if (initialLoading) {
      return initialLoading
    }

    return !Array.isArray(rows)
  }

  shouldRenderMatchSummary(): boolean {
    const { rows, pageSize, totalCount } = this.props

    if (!Array.isArray(rows)) {
      return false
    }

    const rowCount = rows.length

    if (!isFinite(pageSize!) || rowCount <= pageSize!) {
      if (totalCount === rowCount) {
        return false
      }
    }

    return true
  }
}
