import React from 'react'
import styled from 'styled-components'
import {
  variant,
  border,
  color,
  space,
  typography,
  layout
} from 'styled-system'

import { transition } from '../../utils/style'
import { LoadingLine } from '../Loading'

const inputStyle = variant({ key: 'inputStyles', prop: 'inputStyle' })

const StyledTextArea = styled.textarea`
  box-sizing: border-box;
  outline: none;
  ${border}
  ${color}
  ${layout}
  ${space}
  ${typography}
  ${inputStyle}
  ${transition('borderColor')}
`
StyledTextArea.defaultProps = {
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

const TextArea = ({
  disabled,
  inputStyle,
  onChange,
  onBlur,
  onFocus,
  loading,
  height,
  ...props
}) =>
  (loading && <LoadingLine height={height} width="100%" />) || (
    <StyledTextArea
      disabled={disabled}
      inputStyle={disabled ? 'disabled' : inputStyle}
      onChange={event => onChange && onChange(event.target.value)}
      onBlur={event => onBlur && onBlur(event.target.value)}
      onFocus={event => onFocus && onFocus(event.target.value)}
      height={height}
      {...props}
    />
  )

TextArea.defaultProps = {
  inputStyle: 'base',
  rows: 2,
  height: 60
}

export default TextArea
