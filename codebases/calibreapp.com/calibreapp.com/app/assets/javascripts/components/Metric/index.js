import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { color, typography, variant } from 'styled-system'

const metricStyle = variant({ key: 'metricStyles', prop: 'variant' })

import FieldHelp from '../Forms/FieldHelp'

const STYLE_PROPS = {
  sm: { fontSize: 2 },
  md: { fontSize: 4 },
  lg: { fontSize: 5 }
}

const StyledValue = styled.span`
  font-weight: 400;
  font-variant-numeric: tabular-nums;
  text-align: right;
  ${metricStyle}
  ${typography}
`
StyledValue.defaultProps = {
  lineHeight: 'xs'
}

const Value = props => <StyledValue {...STYLE_PROPS[props.level]} {...props} />

Value.defaultProps = {
  color: 'grey400',
  level: 'sm'
}

Value.propTypes = {
  ...color.propTypes,
  ...typography.propTypes
}

const Unit = styled.span`
  ${color}
  ${typography}
  font-variant-numeric: tabular-nums;
`

Unit.defaultProps = {
  color: 'grey300',
  fontSize: 2,
  lineHeight: 'xs'
}

Unit.propTypes = {
  ...color.propTypes,
  ...typography.propTypes
}

const Heading = ({ shortLabel, abbreviatedLabel, label }) => (
  <>
    {shortLabel || label}
    {abbreviatedLabel ? <span> ({abbreviatedLabel})</span> : null}
  </>
)

const Link = ({ docsPath, label }) => {
  if (!docsPath) return null
  return (
    <a
      href={docsPath}
      className="text-link"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FieldHelp>
        <FormattedMessage
          id="measurements.actions.docs"
          values={{ name: label }}
        />
      </FieldHelp>
    </a>
  )
}

export default Value
export { Value, Unit, Heading, Link }
