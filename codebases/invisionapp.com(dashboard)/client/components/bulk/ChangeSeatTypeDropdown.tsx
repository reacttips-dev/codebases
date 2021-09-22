import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { Dropdown } from '@invisionapp/helios'
import { selectSeats, Seat } from '../../stores/billing'

type SeatTypeKey = 'collaborator' | 'creator'

type ChangeSeatTypeDropdownProps = {
  disabled?: boolean
  isLoading?: boolean
  label?: string
  onChange: (type: number) => void
  onChangeVisibility?: (isOpen: { OPEN?: boolean }) => void
  selectedSeats?: number[]
  type: SeatTypeKey
}

const ChangeSeatTypeDropdown = (props: ChangeSeatTypeDropdownProps) => {
  const {
    disabled = false,
    label = 'Change seat type',
    onChange,
    onChangeVisibility = () => {},
    selectedSeats = []
  } = props

  // --- Selectors ---
  const seats = useSelector(selectSeats)

  const isDisabled = (seat: number) =>
    selectedSeats.length === 1 && selectedSeats.includes(seat)
  const isSelected = (seat: number) => selectedSeats.length > 1 && selectedSeats.includes(seat)

  const dropdownItems = seats.map((seat: Seat) => {
    return {
      label: seat.seatTypeName,
      type: 'item',
      onClick: () => onChange(seat.seatTypeId),
      selected: isSelected(seat.seatTypeId),
      disabled: isDisabled(seat.seatTypeId)
    }
  })

  return (
    <StyledDropdown
      trigger={label}
      // @ts-ignore - ignoring because the types are wrong in Helios
      items={dropdownItems}
      closeOnClick
      tooltipChevron="center"
      placement="top"
      tooltipPlacement="top"
      onChangeVisibility={onChangeVisibility}
      disabled={disabled}
    />
  )
}

const StyledDropdown = styled(Dropdown)`
  align-self: center;
`

export default ChangeSeatTypeDropdown
