import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import {
  space,
  buttonStyle,
  border,
  layout,
  typography,
  shadow,
  flex
} from 'styled-system'
import { InlineBox } from '../Grid'
import { LoadingRoundIcon as LoadingIcon } from '../Icon'

import { transition } from '../../utils/style'

const StyledButton = styled.button`
  border: 1px solid transparent;
  border-radius: 3px;
  align-items: center;
  display: inline-flex;
  outline: 0;
  cursor: pointer;
  line-height: 1;
  text-decoration: none;
  opacity: ${({ hidden }) => (hidden ? 0 : 1)};
  visibility: ${({ hidden }) => (hidden ? 'hidden' : 'visible')};
  text-align: center;
  ${transition()};
  ${buttonStyle}
  ${flex}
  ${border}
  ${space}
  ${shadow}
  ${typography}
  ${layout}
`

StyledButton.defaultProps = {
  variant: 'primary',
  fontSize: 0,
  fontWeight: '600',
  p: '12px 12px'
}

const IconWrapper = styled.span`
  line-height: 0;
`

const Button = ({
  as,
  to,
  href,
  children,
  icon,
  disabled,
  variant,
  loading,
  hidden,
  ...props
}) => (
  <StyledButton
    as={disabled ? 'button' : as || (href ? 'a' : to ? Link : 'button')}
    variant={disabled ? `${variant}Disabled` : variant}
    disabled={disabled}
    href={href}
    to={to}
    hidden={hidden}
    {...props}
  >
    {icon ? <IconWrapper>{icon}</IconWrapper> : null}
    {!children || (
      <InlineBox
        as="span"
        ml={icon ? '14px' : 0}
        mr={loading ? '14px' : 0}
        width={1}
      >
        {children}
      </InlineBox>
    )}
    {!loading || <LoadingIcon />}
  </StyledButton>
)

Button.defaultProps = {
  variant: 'primary'
}

export default Button
