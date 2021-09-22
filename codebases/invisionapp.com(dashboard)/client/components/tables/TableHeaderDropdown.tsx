import React from 'react'
import styled from 'styled-components'

import { Dropdown } from '@invisionapp/helios'
import { colors } from '@invisionapp/helios/css/theme'

const TableHeaderDropdown = (props: unknown) => {
  return (
    // @ts-ignore
    <StyledDropdown
      align="left"
      closeOnEsc
      closeOnClick
      closeOnClickOutside
      placement="bottom"
      tabIndex={0}
      {...props}
    />
  )
}

export default TableHeaderDropdown

const StyledDropdown = styled(Dropdown)`
  align-items: flex-start;
  & span,
  & span > div {
    color: ${colors.inkLighter};
    font-weight: 500;
  }
  & span > div:hover {
    text-decoration: underline;
  }
  & span > div:focus {
    outline: none;
  }
`
