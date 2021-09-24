import PropTypes from 'prop-types'
import styled from 'styled-components'
import { space } from 'styled-system'

export const BADGE_TYPES = {
  DEFAULT: undefined,
  NEUTRAL: 'neutral',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',

  // Deprecated
  OK: 'ok',
  LIGHT: 'light'
}

const typeStyles = props => {
  switch (props.type) {
    case BADGE_TYPES.SUCCESS:
      return `
        color: ${props.theme.colors.green500};
        background-color: ${props.theme.colors.green200};
        border-color: ${props.theme.colors.green200};
        font-weight: 500;
        letter-spacing: 0.03em;
        text-transform: uppercase;
      `
    case BADGE_TYPES.ERROR:
      return `
        color: ${props.theme.colors.red500};
        background-color: ${props.theme.colors.red200};
        border-color: ${props.theme.colors.red200};
        font-weight: 500;
        letter-spacing: 0.03em;
        text-transform: uppercase;
      `
    case BADGE_TYPES.WARNING:
      return `
        color: ${props.theme.colors.yellow500};
        background-color: ${props.theme.colors.yellow300};
        border-color: ${props.theme.colors.yellow300};
        font-weight: 500;
        letter-spacing: 0.03em;
        text-transform: uppercase;
      `
    case BADGE_TYPES.NEUTRAL:
      return `
        color: ${props.theme.colors.grey500};
        background-color: ${props.theme.colors.grey200};
        border-color: ${props.theme.colors.grey200};
        font-weight: 500;
        letter-spacing: 0.03em;
        text-transform: uppercase;
      `

    // Deprcated
    case BADGE_TYPES.OK:
      return `
        color: ${props.theme.colors.green300};
        background-color: ${props.theme.colors.green100};
        border-color: ${props.theme.colors.green100};
        text-transform: uppercase;
      `
    case BADGE_TYPES.LIGHT:
      return `
        color: ${props.theme.colors.grey300};
        border-color: ${props.theme.colors.grey200};
      `
    case BADGE_TYPES.DEFAULT:
    default:
      return `
        color: ${props.theme.colors.grey500};
        background-color: ${props.theme.colors.grey200};
        border-color: ${props.theme.colors.grey200};
      `
  }
}

const Badge = styled.span`
  border: 1px solid transparent;
  border-radius: 3px;
  display: inline-block;
  font-size: 12px;
  line-height: 14px;
  font-weight: 500;
  text-align: center;
  vertical-align: middle;

  ${props =>
    props.rounded &&
    `
    border-radius: 100%;
    height: 0.7rem;
    width: 0.7rem;
  `};

  ${props => typeStyles(props)}
  ${space}
`
Badge.propTypes = {
  type: PropTypes.oneOf(Object.values(BADGE_TYPES)),
  rounded: PropTypes.bool,
  ...space.propTypes
}
Badge.defaultProps = {
  py: '2px',
  px: 1
}

export default Badge
