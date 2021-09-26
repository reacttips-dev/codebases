import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Marker from './Marker'
import { markerPropTypes } from './'
import { transition } from '../../utils/style'

const Group = styled.g`
  &:hover {
    text {
      opacity: 1;
      visibility: visible;
    }
  }
`

const Line = styled.line`
  opacity: 0.5;
  stroke: ${props => props.color || props.theme.colors.grey200};
  stroke-width: ${props => props.strokeWidth}px;
`
Line.defaultProps = {
  strokeWidth: 1
}
Line.propTypes = {
  color: PropTypes.string,
  strokeWidth: PropTypes.number
}

const Text = styled.text`
  opacity: 0;
  text-anchor: middle;
  visibility: hidden;
  ${transition('opacity')};
`
Text.defaultProps = {
  fontSize: 10
}

const Markers = ({ height, margin, markerPoints }) =>
  markerPoints.map((point, index) => (
    <Group key={index}>
      <Line
        y1={0}
        y2={height - margin.top - margin.bottom + 10}
        x1={point.x.scaled}
        x2={point.x.scaled}
      />
      <Marker
        onClick={point.onClick}
        cx={point.x.scaled}
        cy={height - margin.top - margin.bottom + 10}
      />
    </Group>
  ))

Markers.defaultProps = {
  margin: {},
  markerPoints: []
}

Markers.propTypes = {
  height: PropTypes.number.isRequired,
  markerPoints: PropTypes.arrayOf(PropTypes.shape(markerPropTypes))
}

export default Markers
