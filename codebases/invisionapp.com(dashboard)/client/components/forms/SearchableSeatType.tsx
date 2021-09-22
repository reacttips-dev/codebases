import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { Text } from '@invisionapp/helios'
import { Searchable, SearchableOption } from '../Searchable'
import { selectSeats } from '../../stores/billing'
import { seatTypesDictionary } from '../dialogs/ChangeSeatTypeDialog'

type SearchableSeatTypeProps = {
  id?: string
  onSelect: (option: any | null) => void
  placeholder?: string
}

export const SearchableSeatType = (props: SearchableSeatTypeProps) => {
  const { id, onSelect, placeholder } = props

  const seats = useSelector(selectSeats)

  return (
    <Searchable
      id={id ?? 'choose-seat-type'}
      options={seats}
      placeholder={placeholder ?? 'Select'}
      getKey={option => option.seatTypeId}
      onSelect={onSelect}
      searchKey="seatType"
      renderInputValue={option => option?.seatTypeName}
      renderOption={seat => {
        return (
          <SearchableOption>
            <div>
              <Header order="body">{seatTypesDictionary[seat.seatTypeName].label}</Header>
              <Description order="body" size="smaller" color="text-lightest">
                {seatTypesDictionary[seat.seatTypeName].description}
              </Description>
            </div>
          </SearchableOption>
        )
      }}
    />
  )
}

const Header = styled(Text)`
  margin-top: ${({ theme }) => theme.spacing.s};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`

const Description = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  line-height: 21px;
`
