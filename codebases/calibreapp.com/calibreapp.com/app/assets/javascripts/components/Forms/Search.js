import React, { forwardRef, useState, useEffect } from 'react'
import classNames from 'classnames'
import styled from 'styled-components'

import { LoadingRoundIcon as LoadingIcon, SearchIcon } from '../Icon'
import { InlineBox } from '../Grid'
import useDebounce from '../../utils/debounce'

const Wrapper = styled(InlineBox)`
  position: relative;

  > span {
    pointer-events: none;
    position: absolute;
  }

  input {
    box-sizing: border-box;
    padding-left: 30px;
    width: 100%;

    ::placeholder {
      opacity: 1;
    }
  }
`

const Search = forwardRef(function Search(
  { className, onChange, placeholder, type, loading, ...props },
  ref
) {
  const classes = classNames(className, 'form__text_input')
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 250)
  useEffect(() => {
    onChange && onChange(searchTerm)
  }, [debouncedSearchTerm])

  return (
    <Wrapper {...props}>
      {loading ? (
        <InlineBox as="span" mt="11px" ml="10px">
          <LoadingIcon />
        </InlineBox>
      ) : (
        <InlineBox as="span" mt="8px" ml="10px">
          <SearchIcon />
        </InlineBox>
      )}
      <input
        name="search"
        ref={ref}
        type={type}
        className={classes}
        onChange={e => setSearchTerm(e.target.value)}
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
