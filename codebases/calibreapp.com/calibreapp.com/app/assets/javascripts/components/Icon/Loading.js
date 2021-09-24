import React from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'

const pulse = keyframes`
  from { opacity: 0; transform: scale(.9); }
  to { opacity: 1; transform: scale(1); }
`

const Circle = styled.circle`
  fill: ${props => props.theme.colors[props.color]};
  animation: ${pulse} 1s ease-in-out infinite;
  animation-direction: alternate;
  animation-delay: ${props => props.delay};
  transform-origin: 50% 0;
`

const Loading = ({ color, height, width }) => (
  <svg viewBox="0 0 25 5" height={height} width={width}>
    <Circle color={color} cx="2.5" cy="2.5" r="2" delay="0ms" />
    <Circle color={color} cx="12.5" cy="2.5" r="2" delay="100ms" />
    <Circle color={color} cx="22.5" cy="2.5" r="2" delay="200ms" />
  </svg>
)

Loading.defaultProps = {
  color: 'grey300',
  minHeight: 'auto',
  height: '10px',
  width: '15px'
}

Loading.propTypes = {
  color: PropTypes.string,
  minHeight: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string
}

export default Loading
