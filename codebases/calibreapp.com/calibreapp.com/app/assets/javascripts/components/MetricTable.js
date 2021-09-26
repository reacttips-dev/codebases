import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  margin-left: -15px;
  overflow-x: auto;
  padding-left: 15px;
  position: relative;
`

const StyledTable = styled.table`
  width: 100%;

  thead td,
  thead th {
    padding-bottom: ${props => props.theme.space[2]};
    vertical-align: bottom;
    white-space: nowrap;
    min-width: 190px;
  }

  th {
    font-weight: 600;
    font-size: ${props => props.theme.fontSizes[1]};
    color: ${props => props.theme.colors.grey300};
    text-transform: uppercase;

    &.active {
      color: ${props => props.theme.colors.grey400};
    }
  }

  th,
  td {
    text-align: right;
  }

  th:first-child,
  td:first-child {
    text-align: left;
  }

  tbody td {
    border-top: 1px solid ${props => props.theme.colors.grey50};
    padding: ${props => props.theme.space[2]} 0;
  }
`

const Table = props => (
  <Wrapper>
    <StyledTable {...props} />
  </Wrapper>
)
Table.defaultProps = {}

export default Table
