import React from 'react'

import StyledIcon from './'

const Drag = ({ width, height, color, ...props }) => (
  <StyledIcon width={width} height={height} color={color} {...props}>
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="512px"
      height="512px"
      viewBox="0 0 512 512"
      enableBackground="new 0 0 512 512"
    >
      <g fill="currentColor">
        <rect y="144" width="512" height="32" />
        <rect y="240" width="512" height="32" />
        <rect y="336" width="512" height="32" />
      </g>
    </svg>
  </StyledIcon>
)

Drag.defaultProps = {
  width: 15,
  height: 15
}

export default Drag
