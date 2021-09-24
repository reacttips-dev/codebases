import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import {
  border,
  color,
  space,
  typography,
  variant,
  layout
} from 'styled-system'

import { PlusIcon, MinusIcon } from '../Icon'
import Button from '../Button'
import { LoadingLine } from '../Loading'
import { transition } from '../../utils/style'

const inputStyle = variant({ key: 'inputStyles', prop: 'inputStyle' })

const Wrapper = styled.div`
  position: relative;
`

const StyledInput = styled.input`
  box-sizing: border-box;
  outline: none;
  ${border}
  ${color}
  ${layout}
  ${space}
  ${typography}
  ${transition('borderColor')}
  ${inputStyle}
`
StyledInput.defaultProps = {
  borderColor: 'grey200',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderRadius: '3px',
  color: 'grey400',
  textAlign: 'center',
  p: 2,
  fontSize: 0,
  width: 40
}

const Input = ({
  disabled,
  inputStyle,
  onChange,
  onBlur,
  onFocus,
  loading,
  value,
  qa,
  ...props
}) => {
  const [number, setNumber] = useState(value)
  useEffect(() => setNumber(value), [value])

  const handleChange = value => {
    const number = value < 0 ? 0 : value
    setNumber(number)
    onChange && onChange(number)
  }

  return (
    <Wrapper>
      {(loading && <LoadingLine height={40} width={40} />) || (
        <>
          <StyledInput
            disabled={disabled}
            inputStyle={disabled ? 'disabled' : inputStyle}
            onChange={event => handleChange(event.target.value)}
            onBlur={() => onBlur && onBlur(number)}
            onFocus={() => onFocus && onFocus(number)}
            value={number}
            data-qa={qa}
            {...props}
          />
          <Button
            data-qa={`${qa}Increase`}
            variant="tertiary"
            mx="5px"
            onClick={() => handleChange(number + 1)}
            type="button"
          >
            <PlusIcon verticalAlign="middle" mt="-1px" />
          </Button>
          <Button
            data-qa={`${qa}Decrease`}
            variant="tertiary"
            onClick={() => handleChange(number - 1)}
            type="button"
            hidden={number === 0}
          >
            <MinusIcon verticalAlign="middle" mt="-9px" />
          </Button>
        </>
      )}
    </Wrapper>
  )
}

Input.defaultProps = {
  type: 'text',
  inputStyle: 'base',
  value: 0
}

export default Input
