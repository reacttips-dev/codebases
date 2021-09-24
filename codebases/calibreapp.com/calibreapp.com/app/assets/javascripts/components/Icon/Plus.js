import React from 'react'

import StyledIcon from './'

const Plus = ({ height, width, color, ...props }) => (
  <StyledIcon color={color} height={height} width={width} {...props}>
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 8V14H8V8H14V6H8V0H6V6H0V8H6Z"
        fill="currentColor"
      />
    </svg>
  </StyledIcon>
)
Plus.defaultProps = {
  width: 14,
  height: 14
}

export default Plus
