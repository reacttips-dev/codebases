import React from 'react'
import styled from 'styled-components'
import {
  border,
  color,
  space,
  typography,
  variant,
  layout
} from 'styled-system'

import { transition } from '../../utils/style'
import { ChevronIcon } from '../Icon'
import { LoadingLine } from '../Loading'

const selectStyle = variant({ key: 'inputStyles', prop: 'selectStyle' })

const Wrapper = styled.span`
  position: relative;
`

const Icon = styled.span`
  position: absolute;
  pointer-events: none;
  right: 10px;
  top: 8px;
  transform: translateY(-25%);
`

const StyledSelect = styled.select`
  background: none;
  appearance: none;
  cursor: pointer;
  outline: none;
  ${transition()};
  ${border}
  ${color}
  ${selectStyle}
  ${layout}
  ${space}
  ${typography}
`
StyledSelect.defaultProps = {
  borderColor: 'grey200',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderRadius: '3px',
  color: 'grey400',
  px: 2,
  py: '7px',
  fontSize: 0,
  fontWeight: 'normal',
  width: 1
}

const Select = ({
  children,
  selectStyle,
  disabled,
  options,
  onChange,
  loading,
  ...props
}) => (
  <Wrapper>
    {(loading && <LoadingLine height={40} width="100%" />) || (
      <>
        <Icon iconStyle={selectStyle}>
          <ChevronIcon color="grey300" />
        </Icon>
        <StyledSelect
          disabled={disabled}
          selectStyle={disabled ? 'disabled' : selectStyle}
          onChange={event => onChange && onChange(event.target.value)}
          {...props}
        >
          {children ||
            options.map(({ label, ...props }, index) => (
              <option key={index} {...props}>
                {label}
              </option>
            ))}
        </StyledSelect>
      </>
    )}
  </Wrapper>
)
Select.defaultProps = {
  selectStyle: 'base'
}

export default Select
