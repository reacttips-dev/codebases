import React from 'react'

import StyledIcon from './'

const Minus = ({ height, width, color, ...props }) => (
  <StyledIcon color={color} height={height} width={width} {...props}>
    <svg width="14" height="2" viewBox="0 0 14 2" fill="none">
      <line y1="1" x2="14" y2="1" stroke="currentColor" strokeWidth="2" />
    </svg>
  </StyledIcon>
)
Minus.defaultProps = {
  width: 14,
  height: 2
}

export default Minus
