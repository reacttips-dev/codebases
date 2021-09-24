import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { PositionOnAxis } from './'

const Text = styled.text`
  fill: ${props => props.color || props.theme.colors.grey300};
`

const TickLabels = ({
  align,
  fontSize,
  formatter,
  offset,
  orientation,
  scale,
  ticks
}) => {
  const position = PositionOnAxis[orientation]

  return ticks.map((tick, index) => (
    <g key={index} transform={position.transform(scale(tick))}>
      <Text
        fontSize={fontSize}
        transform={`translate(${position.text(offset, fontSize, align)}) `}
      >
        <tspan textAnchor={position.textAnchor()}>{formatter(tick)}</tspan>
      </Text>
    </g>
  ))
}

TickLabels.defaultProps = {
  align: 'bottom',
  fontSize: 12,
  formatter: tick => tick,
  offset: 5,
  orientation: 'x',
  ticks: []
}

TickLabels.propTypes = {
  align: PropTypes.string,
  color: PropTypes.string,
  fontSize: PropTypes.number,
  formatter: PropTypes.func,
  offset: PropTypes.number,
  orientation: PropTypes.oneOf(['x', 'y']),
  scale: PropTypes.func.isRequired,
  ticks: PropTypes.array
}

export default TickLabels
