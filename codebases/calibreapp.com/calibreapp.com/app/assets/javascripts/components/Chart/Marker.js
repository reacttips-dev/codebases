import React from 'react'
import styled from 'styled-components'

const Circle = styled.circle`
  fill: ${props => props.theme.colors[props.active ? 'grey500' : 'grey200']};
  cursor: pointer;
`
Circle.defaultProps = {
  r: 3
}

const InnerCircle = styled.circle`
  fill: white;
  pointer-events: none;
`
InnerCircle.defaultProps = {
  r: 2
}

const Marker = props => (
  <React.Fragment>
    <Circle {...props} />
    <InnerCircle {...props} />
  </React.Fragment>
)

Marker.defaultProps = {
  active: false
}

export default Marker
