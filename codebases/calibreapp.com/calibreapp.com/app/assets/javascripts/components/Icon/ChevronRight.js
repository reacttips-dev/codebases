import React from 'react'

import StyledIcon from './'

const ChevronRight = ({ height, width, color, ...props }) => (
  <StyledIcon color={color} height={height} width={width} {...props}>
    <svg
      width="9"
      height="14"
      viewBox="0 0 9 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 12L7.13333 7.13333L2 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
      />
    </svg>
  </StyledIcon>
)
ChevronRight.defaultProps = {
  width: 9,
  height: 14,
  verticalAlign: 'initial'
}

export default ChevronRight
