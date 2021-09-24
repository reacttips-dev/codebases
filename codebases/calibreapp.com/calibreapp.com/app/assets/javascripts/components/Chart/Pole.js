import React, { useContext } from 'react'
import styled from 'styled-components'

import { ChartContext } from './'

const Line = styled.line`
  stroke: ${props => props.theme.colors.grey200};
  stroke-width: ${props => props.strokeWidth}px;
`
Line.defaultProps = {
  strokeWidth: 1
}

const Pole = ({ height, margin }) => {
  const {
    state: { nearestPoint }
  } = useContext(ChartContext)

  if (!nearestPoint) return <React.Fragment />

  const x = nearestPoint ? nearestPoint.x.scaled : 0

  return <Line x1={x} x2={x} y1={0} y2={height - margin.bottom - margin.top} />
}

Pole.defaultProps = {
  inset: 0,
  margin: {}
}

Pole.propTypes = {}

export default Pole
