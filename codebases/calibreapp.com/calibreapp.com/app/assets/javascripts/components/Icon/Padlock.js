import React from 'react'

import StyledIcon from './'

const Padlock = ({ width, height, color, ...props }) => (
  <StyledIcon width={width} height={height} color={color} {...props}>
    <svg
      width="14"
      height="16"
      viewBox="0 0 14 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 4C5 2.89543 5.89543 2 7 2C8.10457 2 9 2.89543 9 4V6H5V4ZM3 6V4C3 1.79086 4.79086 0 7 0C9.20914 0 11 1.79086 11 4V6H12H14V8V14V16H12H2H0V14V8V6H2H3ZM3 8H2V14H12V8H11H9H5H3Z"
        fill="currentColor"
      />
    </svg>
  </StyledIcon>
)

Padlock.defaultProps = {
  color: 'rgb(145,145,145)',
  width: 14,
  height: 16
}

export default Padlock
