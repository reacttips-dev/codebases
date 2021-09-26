import React, { forwardRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Input } from '../Forms'
import { LoadingRoundIcon as LoadingIcon } from '../Icon'
import { Box } from '../Grid'

import useDebounce from '../../utils/debounce'
import { transition } from '../../utils/style'

const Icon = styled(Box)`
  line-height: 1;
  opacity: ${({ active }) => (active ? 1 : 0)};
  position: absolute;
  right: 15px;
  transform: translateY(-50%);
  ${transition('all')};
  top: 50%;
  visibility: ${({ active }) => (active ? 'visible' : 'hidden')};
  z-index: 1;
`
Icon.defaultProps = {
  as: 'span',
  color: 'blue100'
}

const Wrapper = styled(Box)`
  position: relative;

  input {
    box-sizing: border-box;
    ${transition('all')};
  }

  > span {
    pointer-events: none;
  }
`

const Search = forwardRef(function Search(
  { active, onChange, placeholder, type, loading, onFocus, onKeyUp, ...props },
  ref
) {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 250)
  useEffect(() => {
    onChange && onChange(searchTerm)
  }, [debouncedSearchTerm])
  const isWindows = window?.navigator?.platform?.indexOf('Win') > -1

  return (
    <Wrapper {...props}>
      <Icon active={loading}>
        <LoadingIcon />
      </Icon>
      <Icon
        active={!active}
        backgroundColor="blue400"
        px="6px"
        py="3px"
        borderRadius="3px"
      >
        <FormattedMessage
          id={`navigation.search.indicator.${isWindows ? 'windows' : 'mac'}`}
        />
      </Icon>
      <Input
        name="search"
        inputStyle={active ? 'base' : 'inactive'}
        ref={ref}
        type={type}
        onChange={setSearchTerm}
        onKeyUp={onKeyUp}
        onFocus={onFocus}
        placeholder={placeholder}
        autoComplete="off"
      />
    </Wrapper>
  )
})

Search.defaultProps = {
  type: 'search',
  placeholder: 'Search',
  fontSize: '14px'
}

export default Search
