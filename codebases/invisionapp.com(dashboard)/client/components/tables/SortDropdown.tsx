import React from 'react'
import { useSelector } from 'react-redux'
import { Link as RouterLink } from 'react-router'
import styled from 'styled-components'

import { selectLocationQuery } from '../../stores/location'
import TableHeaderDropdown from './TableHeaderDropdown'
import SortDirection from './SortDirection'
import { TeamManagementTab } from '../../app'

import { trackRemovedUsersOwnedDocumentsSorted } from '../../helpers/analytics'

type SortDropdownProps = {
  label: string
  sortName: string
  clearName?: string
  tab: TeamManagementTab
}

const SortDropdown = (props: SortDropdownProps) => {
  const { label, sortName, tab, clearName } = props

  const sort = useSelector(selectLocationQuery(sortName))

  const renderLabel = () => {
    return (
      <StyledHeading>
        {label}
        <SortDirection direction={sort} />
      </StyledHeading>
    )
  }

  const handleClick = (value: string) => {
    if (tab === 'removed-users') {
      trackRemovedUsersOwnedDocumentsSorted(value)
    }
  }

  const updateSortQuery = (sortOrder: string) => {
    const query = { [sortName]: sort === sortOrder ? undefined : sortOrder }
    if (clearName !== undefined) {
      query[clearName] = undefined
    }
    return query
  }

  return (
    <TableHeaderDropdown
      aria-label="Sort column"
      // @ts-ignore
      items={[
        {
          label: 'Order',
          type: 'label'
        },
        {
          element: RouterLink,
          label: 'Ascending',
          onClick: () => {
            handleClick('Ascending')
          },
          selected: sort === 'asc',
          // @ts-ignore
          to: location => ({
            ...location,
            query: updateSortQuery('asc')
          }),
          type: 'item'
        },
        {
          element: RouterLink,
          label: 'Descending',
          onClick: () => {
            handleClick('Descending')
          },
          selected: sort === 'desc',
          // @ts-ignore
          to: location => ({
            ...location,
            query: updateSortQuery('desc')
          }),
          type: 'item'
        }
      ]}
      trigger={renderLabel()}
    />
  )
}

const StyledHeading = styled.div`
  display: flex;
  align-items: center;

  // hide the helios dropdown icon
  & + div {
    display: none;
  }
`

export default SortDropdown
