import React from 'react'
import styled from 'styled-components'

import { transition } from '../../utils/style'

import Label from './Label'

const StyledRadio = styled.input`
  appearance: none;
  left: 8px;
  position: absolute;
  top: 8px;
`

StyledRadio.defaultProps = {
  type: 'radio'
}

const RadioWrapper = styled.div`
  cursor: pointer;
  position: relative;
`

const RadioLabel = styled(Label)`
  align-items: flex-start;
  cursor: pointer;
  display: flex;
  padding-left: 36px;
  position: relative;

  input:checked + & {
    &:before {
      transform: scale(1);
    }
    &:after {
      background-color: ${({ theme }) => theme.colors.green50};
      border-color: ${({ theme }) => theme.colors.green300};
    }
  }

  &:before,
  &:after {
    border-radius: 50%;
    box-sizing: border-box;
    content: '';
    display: block;
    height: 26px;
    left: 0px;
    pointer-events: none;
    position: absolute;
    top: 0px;
    width: 26px;
  }

  &:before {
    background: ${({ theme, disabled }) =>
      disabled ? theme.colors.grey50 : theme.colors.green300};
    height: 14px;
    left: 6px;
    top: 6px;
    transform: scale(0);
    width: 14px;
    z-index: 2;
  }

  &:after {
    border: solid 1px ${({ theme }) => theme.colors.grey200};
    background: ${({ theme, disabled }) =>
      disabled ? theme.colors.grey50 : 'white'};
    color: white;
    text-align: center;
    ${transition({ attribute: 'transform' })};
    z-index: 1;
  }
`
RadioLabel.defaultProps = {
  fontWeight: 1
}

const Radio = ({ children, id, disabled, ...props }) => (
  <RadioWrapper>
    <StyledRadio id={id} disabled={disabled} {...props} />
    <RadioLabel htmlFor={id} color="grey400" disabled={disabled}>
      {children}
    </RadioLabel>
  </RadioWrapper>
)
Radio.defaultProps = {
  id: 'checkbox'
}

export default Radio
