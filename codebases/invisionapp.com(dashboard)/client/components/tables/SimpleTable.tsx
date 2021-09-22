import React from 'react'
import styled from 'styled-components'
import { Search, Spaced } from '@invisionapp/helios'
import TableBody from './TableBody'
import { Table } from './Table'
import LoadingRow from './LoadingRow'
import CrossFade from '../CrossFade'
import { removeLocationQuery, updateLocationQuery } from '../../stores/location'

type SimpleTableProps<T = any> = {
  handleRowClick?: (item: T) => void
  hideBulk?: boolean
  isRowChecked?: (item: T) => boolean
  items: T[]
  loading?: boolean
  loadingRowCount?: number
  renderHeader?: (SearchComponent: any) => any
  renderRow: (item: T) => any
  rowDisabledMessage?: (item: T) => string | null
  rowKey: (item: T) => string
  rowTransition?: boolean
  search?: boolean
  searchQuery?: string
  willLoad?: boolean
}

const SimpleTable = (props: SimpleTableProps) => {
  const {
    rowDisabledMessage,
    loadingRowCount,
    isRowChecked = () => false,
    handleRowClick = () => {},
    items,
    hideBulk,
    renderRow,
    rowKey,
    rowTransition,
    searchQuery,
    willLoad,
    loading,
    renderHeader = () => null,
    ...rest
  } = props

  const handleSearchOnChange = (event: React.FormEvent<HTMLElement>) => {
    const { value } = event.target as HTMLInputElement

    if (value !== searchQuery) {
      updateLocationQuery({
        key: 'search',
        value
      })
    }
  }

  const handleSearchOnClose = (isOpen: boolean) => {
    if (!isOpen) {
      removeLocationQuery('search')
    }
  }

  const SearchComponent = () => {
    return (
      <StyledSearch
        id="search-people"
        onChange={handleSearchOnChange}
        onChangeVisibility={handleSearchOnClose}
        initialValue={searchQuery || ''}
        initialOpen={!!searchQuery}
      />
    )
  }

  const renderLoading = () => {
    return (
      <>
        <div style={{ pointerEvents: 'none', opacity: '0.2' }}>
          <Spaced bottom="s">{renderHeader(SearchComponent)}</Spaced>
        </div>
        {Array.from(new Array(loadingRowCount === undefined ? 3 : loadingRowCount)).map(
          (_, index) => (
            <LoadingRow key={index.toString()} topBorder={index === 0} />
          )
        )}
      </>
    )
  }

  const renderTable = () => {
    return (
      <>
        <Spaced bottom="s">{renderHeader(SearchComponent)}</Spaced>

        {items.length > 0 && (
          <Table {...rest}>
            <TableBody
              isRowChecked={isRowChecked}
              rowDisabledMessage={rowDisabledMessage}
              handleRowClick={handleRowClick}
              items={items}
              renderRow={renderRow}
              rowKey={rowKey}
              rowTransition={rowTransition}
              hideBulk={hideBulk}
            />
          </Table>
        )}
      </>
    )
  }

  const renderWithLoader = () => {
    return (
      <CrossFade fadeKey={loading ? 'true' : 'false'} fadeMs={250}>
        {loading ? renderLoading() : renderTable()}
      </CrossFade>
    )
  }

  return willLoad ? renderWithLoader() : renderTable()
}

// Let the search input float over the table headers
const StyledSearch = styled(Search)`
  position: absolute;
  z-index: 2;
  pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
  & > button {
    position: absolute;
  }
`

export default SimpleTable
