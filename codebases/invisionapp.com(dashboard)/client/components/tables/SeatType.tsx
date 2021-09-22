import React from 'react'
import { useSelector } from 'react-redux'
import { LoadingDots, Text } from '@invisionapp/helios'
import { NewWindow } from '@invisionapp/helios/icons'
import styled from 'styled-components'

import { selectSeats, getSeatById } from '../../stores/billing'
import { Member } from '../../stores/members'
import CrossFade from '../CrossFade'

type SeatTypeProps = {
  canChangeSeatType?: boolean
  onChange: (member: Member) => {}
  isLoading?: boolean
  member: Member
  seatTypeId: number
}

const SeatType = (props: SeatTypeProps) => {
  const { canChangeSeatType, seatTypeId, isLoading, member, onChange } = props

  // --- Selectors ---
  const seats = useSelector(selectSeats)
  const seatName = getSeatById(seats, seatTypeId)

  return (
    <CrossFade fadeKey={isLoading ? 'true' : 'false'} fadeMs={150}>
      {isLoading ? (
        <StyledLoadingDots color="text" data-test-selector="loading" />
      ) : (
        <StyledText
          order="body"
          color="text"
          data-test-selector="last-seen"
          align="right"
          className={canChangeSeatType ? 'clickable' : ''}
          onClick={() => canChangeSeatType && onChange(member)}
        >
          {seatName}
          {canChangeSeatType && (
            <StyledNewWindow fill="text-light" size={24} strokeWidth="1.5" viewBox="24" />
          )}
        </StyledText>
      )}
    </CrossFade>
  )
}

const StyledText = styled(Text)`
  &.clickable {
    cursor: pointer;
  }
  &.clickable:hover {
    text-decoration: underline;
  }
`
// N.B.:
// .isActive class comes from NewTable.tsx
const StyledNewWindow = styled(NewWindow)`
  position: absolute;
  margin-left: -5px;
  opacity: 0;
  transition: all 0.25s ease-in-out;
  .isActive & {
    margin-left: -2px;
    opacity: 1;
  }
`

const StyledLoadingDots = styled(LoadingDots)`
  opacity: 50%;
`

export default SeatType
