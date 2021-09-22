import React from 'react'
import styled from 'styled-components'
import SelectForm from '../SelectForm'

const getNumericOptions = (min, max) => {
  const numbers = []

  for (let i = min; i <= max; i += 1) {
    numbers.push({
      label: i,
      value: i
    })
  }

  return numbers
}

const NumericSelect = ({ id, placeholder, value, max, min = 0, onChange }) => (
  <StyledSelect
    id={id}
    placeholder={placeholder ?? min}
    value={value}
    options={getNumericOptions(min, max)}
    onChange={({ target }) => onChange(target.value.value)}
    clearable={false}
    searchable={false}
  />
)

const StyledSelect = styled(SelectForm)`
  .Select-control {
    width: ${({ theme }) => theme.spacing.xxl};
    height: ${({ theme }) => theme.spacing.m};
  }
`

export default NumericSelect
