import React from 'react'
import styled from 'styled-components'

import { dotPropTypes } from './'

const Circle = styled.circle`
  fill: ${props => props.color};
  cursor: pointer;
  pointer-events: ${props => (props.active ? 'visiblePoint' : 'none')};
  stroke: ${props => props.color};
  stroke-width: ${props => (props.active ? 5 : 0)};
`
Circle.defaultProps = {
  r: 4
}

const InnerCircle = styled.circle`
  fill: white;
  pointer-events: none;
`
InnerCircle.defaultProps = {
  r: 2
}

const Dot = props => (
  <React.Fragment>
    <Circle {...props} />
    <InnerCircle {...props} />
  </React.Fragment>
)

Dot.defaultProps = {
  active: false,
  color: 'black'
}

Dot.propTypes = dotPropTypes

export default Dot
