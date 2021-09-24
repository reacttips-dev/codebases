import React from 'react'
import PropTypes from 'prop-types'
import { line } from 'd3-shape'
import styled from 'styled-components'

import { dotPropTypes } from './'

const Path = styled.path`
  fill: none;
  stroke: ${props => props.color};
  stroke-width: ${props => props.strokeWidth}px;
`
Path.defaultProps = {
  color: 'black',
  strokeWidth: 2
}

Path.propTypes = {
  color: PropTypes.string
}

const Lines = ({ seriesPoints }) => {
  const path = line()
    .x(point => point.x.scaled)
    .y(point => point.y.scaled)

  return seriesPoints
    .filter(points => !points[0].hidden)
    .map((points, index) => (
      <Path
        key={index}
        d={path(points.filter(point => point.y.value != null))}
        color={points[0].color}
      />
    ))
}

Lines.defaultProps = {
  seriesPoints: []
}

Lines.propTypes = {
  seriesPoints: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.shape(dotPropTypes))
  )
}

export default Lines
