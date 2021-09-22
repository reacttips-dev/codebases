import React from 'react'
import { useSelector } from 'react-redux'

import { Link as RouterLink } from 'react-router'
import { selectLocationQuery } from '../../stores/location'
import { selectSeats } from '../../stores/billing'
import TableHeaderDropdown from './TableHeaderDropdown'
import {
  trackGuestsSeatTypeFiltered,
  trackMembersSeatTypeFiltered,
  trackRemovedUsersSeatTypeFiltered,
  trackInvitationsSeatTypeFiltered
} from '../../helpers/analytics'
import { TeamManagementTab } from '../../app'
import { seatTypesDictionary } from '../dialogs/ChangeSeatTypeDialog'

type SeatTypeFilterDropdownProps = {
  tab: TeamManagementTab
}

const SeatTypeFilterDropdown = (props: SeatTypeFilterDropdownProps) => {
  const { tab } = props
  const type = useSelector(selectLocationQuery('seatType'))
  const seats = useSelector(selectSeats)

  const handleClick = (value: string) => {
    switch (tab) {
      case 'members':
        trackMembersSeatTypeFiltered(value)
        break
      case 'guests':
        trackGuestsSeatTypeFiltered(value)
        break
      case 'invitations':
        trackInvitationsSeatTypeFiltered(value)
        break
      case 'removed-users':
        trackRemovedUsersSeatTypeFiltered(value)
        break
      default:
    }
  }

  const items = [
    {
      element: RouterLink,
      label: 'All seats',
      onClick: () => {
        handleClick('All seats')
      },
      selected: type === undefined,
      // @ts-ignore
      to: location => ({
        ...location,
        query: { ...location.query, seatType: undefined }
      }),
      // @ts-ignore
      type: 'item'
    }
  ]

  seats.forEach(seat => {
    const { label } = seatTypesDictionary[seat.seatTypeName]

    items.push({
      element: RouterLink,
      label,
      onClick: () => {
        handleClick(label)
      },
      selected: type === seat.seatTypeId.toString(),
      // @ts-ignore
      to: location => ({
        ...location,
        query: { ...location.query, seatType: seat.seatTypeId }
      }),
      // @ts-ignore
      type: 'item'
    })
  })

  return (
    <TableHeaderDropdown
      aria-label="Filter items by seat type"
      // @ts-ignore
      items={items}
      width={190}
      trigger="Seat type"
    />
  )
}

export default SeatTypeFilterDropdown
