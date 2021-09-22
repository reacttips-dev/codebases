import React, { useState } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { Search as HeliosSearch, Padded } from '@invisionapp/helios'
import {
  removeLocationQuery,
  updateLocationQuery,
  selectLocationQuery
} from '../../stores/location'

type SearchProps = {
  onOpen?: () => void
  onClose?: () => void
  label: string
}

const Search = (props: SearchProps) => {
  const { onOpen = () => {}, onClose = () => {}, label } = props

  const searchQuery = useSelector(selectLocationQuery('search'))
  const [searchOpen, setSearchOpen] = useState(!!searchQuery)

  const handleSearchOnClose = (isOpen: boolean) => {
    if (!isOpen) {
      removeLocationQuery('search')
    }

    setSearchOpen(isOpen)

    if (isOpen) {
      onOpen()
    } else {
      onClose()
    }
  }

  const handleSearchOnChange = (event: React.FormEvent<HTMLElement>) => {
    const { value } = event.target as HTMLInputElement

    if (value !== searchQuery) {
      updateLocationQuery({
        key: 'search',
        value
      })
    }
  }

  return (
    <Wrapper>
      <Container>
        <HeliosSearch
          id="removed-users-search"
          onChangeVisibility={handleSearchOnClose}
          onChange={handleSearchOnChange}
          initialValue={searchQuery || ''}
          initialOpen={searchOpen}
        />
      </Container>
      <Padded left="xl">{label}</Padded>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: relative;
`
const Container = styled.span`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
`

export default Search
