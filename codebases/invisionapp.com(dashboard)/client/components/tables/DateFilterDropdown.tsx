import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { Link as RouterLink } from 'react-router'

import { selectLocationQuery } from '../../stores/location'

import { getMinsFromNow } from '../../helpers/dates'

import TableHeaderDropdown from './TableHeaderDropdown'
import SortDirection from './SortDirection'
import {
  trackGuestsLastSeenFiltered,
  trackGuestsLastSeenSorted,
  trackInvitationsDateFiltered,
  trackInvitationsDateSorted,
  trackMembersLastSeenFiltered,
  trackMembersLastSeenSorted,
  trackRemovedUsersDateSorted
} from '../../helpers/analytics'
import { TeamManagementTab } from '../../app'

const SEVEN_DAYS = 'Over 7 days ago'
const THIRTY_DAYS = 'Over 30 days ago'
const SIXTY_DAYS = 'Over 60 days ago'
const NINETY_DAYS = 'Over 90 days ago'
const DEFAULT_HEADING_LABEL = 'Date'

type DateFilterDropdownProps = {
  align?: 'left' | 'right'
  filtersLabel?: string
  headingLabel?: string
  showFilters: boolean
  showSorting: boolean
  tab: TeamManagementTab
  updateOnClick?: () => {}
  width?: number
  clearName?: string
}

type MenuOption = {
  element?: any
  label?: string
  selected?: boolean
  to?: any
  type?: string
}

const DateFilterDropdown = ({
  align = 'left',
  filtersLabel,
  showFilters = true,
  showSorting = true,
  tab,
  width,
  updateOnClick,
  headingLabel = DEFAULT_HEADING_LABEL,
  clearName
}: DateFilterDropdownProps) => {
  // --- Hooks ---
  const [headingLabelState, setHeadingLabelState] = useState(headingLabel)
  const [updateOnClickState, setUpdateOnClickState] = useState({
    status: 'initial',
    date: new Date()
  })

  // --- Selectors ---
  const dateFilter = useSelector(selectLocationQuery('dateFilter'))
  const dateSort = useSelector(selectLocationQuery('dateSort'))

  useEffect(() => {
    switch (dateFilter) {
      case '7':
        setHeadingLabelState(SEVEN_DAYS)
        break
      case '30':
        setHeadingLabelState(THIRTY_DAYS)
        break
      case '60':
        setHeadingLabelState(SIXTY_DAYS)
        break
      case '90':
        setHeadingLabelState(NINETY_DAYS)
        break
      case '0':
      default:
        setHeadingLabelState(headingLabel)
    }
  }, [dateFilter, headingLabel])

  const renderLabel = () => {
    return (
      <DateHeading>
        {headingLabelState}
        <SortDirection direction={dateSort} />
      </DateHeading>
    )
  }

  const handleFilterClick = (value: string) => {
    switch (tab) {
      case 'guests':
        trackGuestsLastSeenFiltered(value)
        break
      case 'invitations':
        trackInvitationsDateFiltered(value)
        break
      case 'members':
        trackMembersLastSeenFiltered(value)
        break
      default:
    }
  }

  const handleSortClick = (value: string) => {
    switch (tab) {
      case 'guests':
        trackGuestsLastSeenSorted(value)
        break
      case 'invitations':
        trackInvitationsDateSorted(value)
        break
      case 'members':
        trackMembersLastSeenSorted(value)
        break
      case 'removed-users':
        trackRemovedUsersDateSorted(value)
        break
      default:
    }
  }

  const updateSortQuery = (sortOrder: string) => {
    const query = { dateSort: dateSort === sortOrder ? undefined : sortOrder }
    if (clearName !== undefined) {
      // @ts-ignore
      query[clearName] = undefined
    }
    return query
  }

  const filterOptions = [
    {
      label: filtersLabel,
      type: 'label'
    },
    {
      element: RouterLink,
      label: 'Anytime',
      onClick: () => {
        handleFilterClick('Anytime')
      },
      selected: dateFilter === undefined,
      // @ts-ignore
      to: location => ({
        ...location,
        query: { ...location.query, dateFilter: undefined, dateSort: undefined }
      }),
      type: 'item'
    },
    {
      element: RouterLink,
      label: SEVEN_DAYS,
      onClick: () => {
        handleFilterClick(SEVEN_DAYS)
      },
      selected: dateFilter === '7',
      // @ts-ignore
      to: location => ({
        ...location,
        query: { ...location.query, dateFilter: '7' }
      }),
      type: 'item'
    },
    {
      element: RouterLink,
      label: THIRTY_DAYS,
      onClick: () => {
        handleFilterClick(THIRTY_DAYS)
      },
      selected: dateFilter === '30',
      // @ts-ignore
      to: location => ({
        ...location,
        query: { ...location.query, dateFilter: '30' }
      }),
      type: 'item'
    },
    {
      element: RouterLink,
      label: SIXTY_DAYS,
      onClick: () => {
        handleFilterClick(SIXTY_DAYS)
      },
      selected: dateFilter === '60',
      // @ts-ignore
      to: location => ({
        ...location,
        query: { ...location.query, dateFilter: '60' }
      }),
      type: 'item'
    },
    {
      element: RouterLink,
      label: NINETY_DAYS,
      onClick: () => {
        handleFilterClick(NINETY_DAYS)
      },
      selected: dateFilter === '90',
      // @ts-ignore
      to: location => ({
        ...location,
        query: { ...location.query, dateFilter: '90' }
      }),
      type: 'item'
    }
  ]

  const sortingOptions = [
    {
      label: 'Order',
      type: 'label'
    },
    {
      element: RouterLink,
      label: 'Ascending',
      onClick: () => {
        handleSortClick('Ascending')
      },
      selected: dateSort === 'asc',
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
        handleSortClick('Descending')
      },
      selected: dateSort === 'desc',
      // @ts-ignore
      to: location => ({
        ...location,
        query: updateSortQuery('desc')
      }),
      type: 'item'
    }
  ]

  let menuOptions: MenuOption[] = []

  if (showFilters) {
    menuOptions = [...filterOptions]
  }

  if (showSorting) {
    menuOptions = [...menuOptions, ...sortingOptions]
  }

  return (
    <TableHeaderDropdown
      // @ts-ignore
      align={align}
      aria-label="Filter items by date"
      // @ts-ignore
      items={menuOptions}
      trigger={renderLabel()}
      width={width}
      onChangeVisibility={(e: { OPEN: boolean; IS_IN_DOM: boolean; STYLE: any }) => {
        if (updateOnClick === undefined) {
          return
        }
        // the callback will be triggered only after 3 mins
        if (
          e.OPEN &&
          (updateOnClickState.status === 'initial' ||
            getMinsFromNow(updateOnClickState.date) > 3)
        ) {
          updateOnClick()
          setUpdateOnClickState({ status: 'loaded', date: new Date() })
        }
      }}
    />
  )
}

export default DateFilterDropdown

const DateHeading = styled.div`
  display: flex;
  align-items: center;

  & + div {
    display: none; /* hide the helios dropdown icon */
  }
`
