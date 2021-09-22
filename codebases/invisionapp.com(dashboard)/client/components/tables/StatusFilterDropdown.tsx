import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { Tooltip } from '@invisionapp/helios'
import { Link as RouterLink } from 'react-router'
import { selectLocationQuery } from '../../stores/location'
import TableHeaderDropdown from './TableHeaderDropdown'
import { trackGuestsStatusFiltered } from '../../helpers/analytics'

type StatusFilterDropdownProps = {
  activeGuestsCount: number
  inactiveGuestsCount: number
}

const StatusFilterDropdown = (props: StatusFilterDropdownProps) => {
  const { activeGuestsCount, inactiveGuestsCount } = props
  const type = useSelector(selectLocationQuery('statusType'))

  const handleClick = (value: string) => {
    trackGuestsStatusFiltered(value)
  }

  return (
    <TableHeaderDropdown
      aria-label="Filter items by status"
      // @ts-ignore
      items={[
        {
          element: RouterLink,
          label: 'All',
          onClick: () => {
            handleClick('All')
          },
          selected: type === undefined,
          // @ts-ignore
          to: location => ({
            ...location,
            query: { ...location.query, statusType: undefined }
          }),
          // @ts-ignore
          type: 'item'
        },
        {
          element: RouterLink,
          label: `Activated (${activeGuestsCount})`,
          onClick: () => {
            handleClick('Activated')
          },
          selected: type === 'active',
          // @ts-ignore
          to: location => ({
            ...location,
            query: { ...location.query, statusType: 'active' }
          }),
          // @ts-ignore
          type: 'item'
        },
        {
          element: RouterLink,
          label: `Not activated (${inactiveGuestsCount})`,
          onClick: () => {
            handleClick('Not activated')
          },
          selected: type === 'inactive',
          // @ts-ignore
          to: location => ({
            ...location,
            query: { ...location.query, statusType: 'inactive' }
          }),
          // @ts-ignore
          type: 'item'
        }
      ]}
      width={190}
      trigger={
        // @ts-ignore
        <StyledTooltip
          placement="top"
          maxWidth="214px"
          trigger="Status"
          withDelay
          delayDuration="1500"
          withRelativeWrapper
          chevron="center"
        >
          {'Guests become activated (billable) after opening two or more team documents'}
        </StyledTooltip>
      }
    />
  )
}

const StyledTooltip = styled(Tooltip)`
  width: 217px;
  text-align: center;
`

export default StatusFilterDropdown
