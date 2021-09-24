import React from 'react'
import styled from 'styled-components'
import { border, color, fontSize, space, textAlign, width } from 'styled-system'

const STYLE_PROPS = {
  xxs: {
    maxWidth: '1px'
  },
  xs: {
    width: '30px'
  },
  sm: {
    maxWidth: '100px'
  },
  md: {},
  lg: {
    maxWidth: '250px'
  }
}

const Wrapper = styled.div`
  margin-left: -15px;
  overflow-x: ${({ overflow }) => overflow};
  padding-left: 15px;
  position: relative;
  table {
    opacity: ${({ disabled }) => (disabled ? '0.5' : '1')};
  }

  tr {
    pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  }
`
Wrapper.defaultProps = {
  overflow: 'auto'
}

const StyledTable = styled.table`
  max-width: 100%;
  overflow-x: auto;
  text-align: left;
  width: 100%;

  ${({ bleed }) =>
    !bleed
      ? `
  td:first-of-type, th:first-of-type {padding-left: 0;}
  td:last-of-type, th:last-of-type {padding-right: 0;}
`
      : ''}
`

const Table = ({ header, overflow, disabled, ...props }) => (
  <Wrapper overflow={overflow} disabled={disabled}>
    {header}
    <StyledTable {...props} />
  </Wrapper>
)
Table.defaultProps = {
  bleed: true
}

export const Thead = styled.thead``

export const Tr = styled.tr`
  ${({ selectable }) => !selectable || `cursor: pointer;`};
`

export const StyledTd = styled.td`
  vertical-align: ${({ verticalAlign }) => verticalAlign};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: ${({ maxWidth }) => maxWidth};
  opacity: ${({ disabled }) => (disabled ? '.5' : '1')};

  ${color}
  ${border}
  ${fontSize}
  ${space}
  ${textAlign}
  ${width}
`
StyledTd.defaultProps = {
  borderBottomWidth: 0,
  borderLeftWidth: 0,
  borderRightWidth: 0,
  borderTopWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'grey100',
  py: 2,
  px: 3,
  verticalAlign: 'middle'
}

export const Td = props => {
  return <StyledTd {...STYLE_PROPS[props.level]} {...props} />
}

const StyledTh = styled(StyledTd)`
  text-transform: ${({ textTransform }) => textTransform};
  overflow: visible;
  ${({ active, theme }) => (active ? `color: ${theme.colors.grey400}` : null)}
`

export const Th = props => {
  return <StyledTh {...STYLE_PROPS[props.level]} {...props} />
}
Th.defaultProps = {
  as: 'th',
  borderTopWidth: 0,
  color: 'grey400',
  fontSize: '14px',
  fontWeight: 600,
  textTransform: 'uppercase'
}

export const Tbody = styled.tbody`
  :nth-child(odd) tr {
    background: ${({ stripedColor, theme, backgroundColor }) =>
      stripedColor
        ? theme.colors[stripedColor]
        : theme.colors[backgroundColor]};
  }

  ${border}
  ${color}
`
Tbody.defaultProps = {
  backgroundColor: 'white'
}

export default Table
