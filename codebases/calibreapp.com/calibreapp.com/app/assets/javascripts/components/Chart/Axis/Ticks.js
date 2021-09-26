import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { PositionOnAxis } from './'

const TickLine = styled.line`
  stroke: ${props => props.color || props.theme.colors.grey200};
  stroke-width: ${props => props.strokeWidth}px;
`

const Ticks = ({
  align,
  color,
  orientation,
  scale,
  size,
  strokeWidth,
  ticks
}) => {
  const position = PositionOnAxis[orientation]

  return ticks.map((tick, index) => (
    <g key={index} transform={position.transform(scale(tick))}>
      <TickLine
        color={color}
        strokeWidth={strokeWidth}
        {...position.tick(size, align)}
      />
    </g>
  ))
}

Ticks.defaultProps = {
  align: 'bottom',
  ticks: [],
  size: 10,
  strokeWidth: 1,
  orientation: 'x'
}

Ticks.propTypes = {
  align: PropTypes.string,
  color: PropTypes.string,
  orientation: PropTypes.oneOf(['x', 'y']),
  scale: PropTypes.func.isRequired,
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
  ticks: PropTypes.array
}

export default Ticks
