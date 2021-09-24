import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { space, color, colorStyle, textStyle, typography } from 'styled-system'

import { transition, linkStyle } from '../../utils/style'

const STYLE_PROPS = {
  heading: {
    xs: {
      color: 'grey400',
      fontSize: 14,
      textTransform: 'uppercase',
      letterSpacing: '-0.02em'
    },
    sm: {
      color: 'grey500',
      fontSize: 18
    },
    md: {
      color: 'grey500',
      fontSize: 20
    }
  },
  paragraph: {
    xs: {
      color: 'grey400',
      fontSize: 14
    },
    sm: {
      color: 'grey400',
      fontSize: 16
    },
    lg: {
      color: 'grey400',
      fontSize: 20
    }
  }
}

const StyledText = styled.span`
  margin: 0;
  text-transform: ${({ textTransform }) => textTransform};
  word-break: break-word;

  a,
  a:visited {
    color: ${({ theme }) => theme.colors.blue300};
  }

  ${space}
  ${typography}
  ${color}
  ${colorStyle}
  ${textStyle}
`

const Text = ({ level, ...props }) => {
  return <StyledText {...STYLE_PROPS['paragraph'][level]} {...props} />
}

Text.defaultProps = {
  fontWeight: 1,
  color: 'grey400',
  lineHeight: 'lg',
  level: 'sm'
}

Text.propTypes = {
  ...space.propTypes,
  ...typography.propTypes,
  ...color.propTypes,
  ...colorStyle.propTypes,
  ...textStyle.propTypes,
  level: PropTypes.oneOf(Object.keys(STYLE_PROPS.paragraph))
}

const Heading = ({ level, ...props }) => {
  return <StyledText {...STYLE_PROPS['heading'][level]} {...props} />
}
Heading.defaultProps = {
  as: 'h1',
  fontWeight: 3,
  level: 'md',
  margin: 0
}

Heading.propTypes = {
  ...color.propTypes,
  ...typography.propTypes,
  level: PropTypes.oneOf(Object.keys(STYLE_PROPS.heading))
}

const StyledTextLink = styled.a`
  appearance: none;
  background: none;
  outline: 0;
  border: 0;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  transition: ${transition({ attribute: 'color' })};

  ${linkStyle}
  ${typography}
  ${space}
`

const TextLink = ({ to, ...props }) => {
  return <StyledTextLink as={to ? Link : 'a'} to={to} {...props} />
}
TextLink.defaultProps = {
  variant: 'base',
  fontSize: 'base'
}

const Strong = styled(StyledText)``
Strong.defaultProps = {
  as: 'strong',
  fontWeight: 3,
  color: 'grey500'
}

const InlineCode = styled(StyledText)`
  border-radius: 3px;
  border: 1px solid ${({ theme }) => theme.colors.grey100};
  display: inline-block;
  font-family: Menlo, Monaco, Consolas, Courier, monospace;
  font-size: 14px;
  font-weight: normal;
  max-width: 100%;
  overflow: auto;
  padding: 5px;
  white-space: nowrap;
`
InlineCode.defaultProps = {
  ...StyledText.defaultProps,
  backgroundColor: 'grey50'
}

const TruncatedText = styled(StyledText)`
  display: block;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

export default Text
export { default as OrderedList } from './OrderedList'
export {
  StyledText,
  Text,
  Heading,
  STYLE_PROPS,
  TextLink,
  StyledTextLink,
  Strong,
  InlineCode,
  TruncatedText
}
