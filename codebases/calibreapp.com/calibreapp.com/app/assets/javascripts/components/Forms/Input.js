import React, { forwardRef } from 'react'
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
import { CheckIcon, CrossIcon, WarningIcon } from '../Icon'
import { LoadingLine } from '../Loading'

const ICONS = {
  base: null,
  success: <CheckIcon />,
  error: <CrossIcon />,
  warning: <WarningIcon mt="2px" />
}

const inputStyle = variant({ key: 'inputStyles', prop: 'inputStyle' })
const iconStyle = variant({ key: 'iconStyles', prop: 'iconStyle' })

const Wrapper = styled.div`
  position: relative;
`

const Icon = styled.span`
  ${iconStyle}
  -webkit-appearance: none
  background: linear-gradient(90deg,rgba(230,230,230,0) 0px,white 25px);
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  line-height: 0;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  padding-left: 30px;
  padding-right: 5px;
  position: absolute;
  right: 1px;
  top: 50%;
  transform: translateY(-50%);
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
  width: 55px;
  ${transition('opacity')};
`

const StyledInput = styled.input`
  box-sizing: border-box;
  outline: none;
  ${border}
  ${color}
  ${layout}
  ${space}
  ${typography}
  ${transition('borderColor')};
  ${inputStyle}
  ::placeholder {
    color: ${props => props.theme.colors.grey300}
    opacity: 1;
  }
`
StyledInput.defaultProps = {
  borderColor: 'grey200',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderRadius: '3px',
  color: 'grey400',
  p: 2,
  fontSize: 0,
  fontWeight: 'normal',
  width: 1
}

const Input = forwardRef(function Input(
  { disabled, inputStyle, onChange, onBlur, onFocus, loading, ...props },
  ref
) {
  return (
    <Wrapper>
      {(loading && <LoadingLine height={40} width="100%" />) || (
        <>
          <StyledInput
            ref={ref}
            disabled={disabled}
            inputStyle={disabled ? 'disabled' : inputStyle}
            onChange={event => onChange && onChange(event.target.value)}
            onBlur={event => onBlur && onBlur(event.target.value)}
            onFocus={event => onFocus && onFocus(event.target.value)}
            {...props}
          />
          <Icon
            iconStyle={inputStyle}
            visible={!!ICONS[inputStyle]}
            data-qa={`inputIcon${inputStyle}`}
          >
            {ICONS[inputStyle]}
          </Icon>
        </>
      )}
    </Wrapper>
  )
})

Input.defaultProps = {
  type: 'text',
  inputStyle: 'base'
}

export default Input
