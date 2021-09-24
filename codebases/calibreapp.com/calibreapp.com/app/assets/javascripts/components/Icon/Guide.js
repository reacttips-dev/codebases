import React from 'react'

import StyledIcon from './'

const Guide = ({ height, width, color, ...props }) => (
  <StyledIcon color={color} height={height} width={width} {...props}>
    <svg
      width="14"
      height="16"
      viewBox="0 0 14 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13 3.91421V15H1V1H10.0858L13 3.91421Z"
        fill="white"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M3 8H11" stroke="currentColor" strokeWidth="2" />
      <path d="M3 5H9" stroke="currentColor" strokeWidth="2" />
      <path d="M3 11H11" stroke="currentColor" strokeWidth="2" />
    </svg>
  </StyledIcon>
)
Guide.defaultProps = {
  width: 14,
  height: 16
}

export default Guide
