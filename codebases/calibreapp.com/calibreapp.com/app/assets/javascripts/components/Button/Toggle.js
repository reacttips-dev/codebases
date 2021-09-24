import React from 'react'

import styled from 'styled-components'

import { Box } from '../Grid'
import { ChevronIcon } from '../Icon'

const Wrapper = styled(Box)`
  cursor: pointer;
  list-style-image: none;
  position: relative;
  padding-left: 20px;
  outline: 0;

  span {
    position: absolute;
    left: 0;
    top: 50%;
    transform: ${({ open }) =>
      open ? `translateY(-50%) rotate(180deg)` : `translateY(-50%) rotate(0);`};
  }

  &::-webkit-details-marker {
    display: none;
  }

  &:hover,
  &:active {
    color: ${({ theme }) => theme.colors.blue400};
  }
`
Wrapper.defaultProps = {
  color: 'blue300',
  pl: 2,
  mb: 3
}

const Toggle = ({ children, ...props }) => (
  <Wrapper {...props}>
    <ChevronIcon as="span" />
    {children}
  </Wrapper>
)

export default Toggle
