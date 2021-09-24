import React from 'react'
import styled from 'styled-components'

import { CheckIcon } from '../Icon'
import { transition } from '../../utils/style'

import Label from './Label'

const StyledCheckbox = styled.input`
  appearance: none;
  left: 8px;
  position: absolute;
  top: 8px;
`

StyledCheckbox.defaultProps = {
  type: 'checkbox',
  value: 1,
  level: 'md'
}

const CheckboxWrapper = styled.div`
  cursor: pointer;
  position: relative;
`

const Icon = styled.span`
  left: ${props => (props.level == 'sm' ? '4px' : '6px')};
  line-height: 0;
  opacity: 0;
  margin-top: 1px;
  pointer-events: none;
  position: absolute;
  top: ${props => (props.level == 'sm' ? '12px' : '13px')};
  transform: translateY(-50%);
  ${transition()};
  visibiltiy: hidden;
  z-index: 1;
`

const CheckboxLabel = styled(Label)`
  align-items: flex-start;
  cursor: pointer;
  display: flex;
  padding-left: ${props => (props.level == 'sm' ? '28px' : '36px')};
  position: relative;

  input:checked + & {
    &:after {
      transform: scale(1);
    }

    ${Icon} {
      visibiltiy: visible;
      opacity: 1;
    }
  }

  &:before,
  &:after {
    background: ${({ theme, disabled }) =>
      disabled ? theme.colors.grey50 : 'white'};
    border: solid 1px ${({ theme }) => theme.colors.grey200};
    border-radius: 3px;
    box-sizing: border-box;
    content: '';
    display: block;
    height: ${props => (props.level == 'sm' ? '18px' : '26px')};
    left: 0px;
    pointer-events: none;
    position: absolute;
    top: ${props => (props.level == 'sm' ? '3px' : '0px')};
    width: ${props => (props.level == 'sm' ? '18px' : '26px')};
  }

  &:before {
    margin-right: 10px;
  }

  &:after {
    border-color: ${({ theme }) => theme.colors.green300};
    background-color: ${({ theme }) => theme.colors.green300};
    color: white;
    text-align: center;
    transform: scale(0);
    ${transition({ attribute: 'transform' })};
  }
`

CheckboxLabel.defaultProps = {
  fontWeight: 1
}

const Checkbox = ({ children, id, disabled, level, ...props }) => (
  <CheckboxWrapper>
    <StyledCheckbox id={id} disabled={disabled} {...props} />
    <CheckboxLabel
      htmlFor={id}
      color="grey400"
      disabled={disabled}
      level={level}
    >
      <Icon level={level}>
        {level == 'sm' ? (
          <CheckIcon color="white" width="10px" height="8.57px" />
        ) : (
          <CheckIcon color="white" />
        )}
      </Icon>
      {children}
    </CheckboxLabel>
  </CheckboxWrapper>
)
Checkbox.defaultProps = {
  id: 'checkbox'
}

export default Checkbox
