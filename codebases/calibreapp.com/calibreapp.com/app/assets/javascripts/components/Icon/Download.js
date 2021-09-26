import React from 'react'

import StyledIcon from './'

const Download = ({ width, height, color, ...props }) => (
  <StyledIcon width={width} height={height} color={color} {...props}>
    <svg
      width="14"
      height="15"
      viewBox="0 0 14 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.86667 10.6333L2 5.5M6.86667 10.6333L12 5.5M6.86667 10.6333V1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
      />
      <line y1="14" x2="14" y2="14" stroke="#3057F4" strokeWidth="2" />
    </svg>
  </StyledIcon>
)

Download.defaultProps = {
  width: 14,
  height: 15,
  verticalAlign: 'middle'
}

export default Download
