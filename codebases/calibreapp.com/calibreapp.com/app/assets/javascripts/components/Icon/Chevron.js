import React from 'react'

import StyledIcon from './'

const Chevron = ({ height, width, color, ...props }) => (
  <StyledIcon color={color} height={height} width={width} {...props}>
    <svg
      width="14"
      height="9"
      viewBox="0 0 14 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 2L6.86667 7.13333L12 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
      />
    </svg>
  </StyledIcon>
)
Chevron.defaultProps = {
  width: 14,
  height: 9
}

export default Chevron
