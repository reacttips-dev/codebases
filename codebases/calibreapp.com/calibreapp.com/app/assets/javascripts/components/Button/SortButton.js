import React from 'react'
import styled from 'styled-components'

import { ChevronIcon } from '../Icon'

const SortIcon = styled.span`
  left: -14px;
  line-height: 0;
  position: absolute;
  top: ${({ rotate }) => (rotate ? 6 : 8)}px;
  transform: rotate(${({ rotate }) => rotate});
  transform-origin: center center;
`

const StyledButton = styled.button`
  background: none;
  color: ${({ active, theme }) => theme.colors[active ? 'grey500' : 'grey400']};
  border: 0;
  height: 21px;
  line-height: 21px;
  padding: 0;
  text-transform: inherit;
  outline: 0;
  position: relative;

  &:hover {
    color: ${({ theme }) => theme.colors.grey500};
  }
`

const SortButton = ({
  children,
  onUpdateSortBy,
  onUpdateSortDirection,
  attribute,
  sortBy,
  sortDirection,
  ...props
}) => {
  const onClick = () => {
    if (attribute === sortBy) {
      onUpdateSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      onUpdateSortBy(attribute)
    }
  }

  return (
    <StyledButton onClick={onClick} active={attribute === sortBy} {...props}>
      {(sortBy === attribute && (
        <SortIcon rotate={sortDirection === 'asc' ? '180deg' : 0}>
          <ChevronIcon height={6} width={9} />
        </SortIcon>
      )) ||
        null}
      {children}
    </StyledButton>
  )
}

export default SortButton
