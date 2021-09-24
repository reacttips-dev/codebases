import React from 'react'

import StyledIcon from './'

const Warning = ({ width, height, color, ...props }) => (
  <StyledIcon width={width} height={height} color={color} {...props}>
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0H16V16H0V0Z" fill="white" />
      <path d="M8 4V9" stroke="currentColor" strokeWidth="2" />
      <path d="M8 10V12" stroke="currentColor" strokeWidth="2" />
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" />
    </svg>
  </StyledIcon>
)

Warning.defaultProps = {
  width: 16,
  height: 16
}

export default Warning
