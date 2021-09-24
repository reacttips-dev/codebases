import React from 'react'

import StyledIcon from './'

const Trash = ({ height, width, color, ...props }) => (
  <StyledIcon color={color} height={height} width={width} {...props}>
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
        d="M4 0V2H3H2H0V4H2V15V16H3H11H12V15V4H14V2H12H11H10V0H4ZM4 14V4H6V14H4ZM8 14V4H10V14H8Z"
        fill="currentColor"
      />
    </svg>
  </StyledIcon>
)
Trash.defaultProps = {
  width: 16,
  height: 16
}

export default Trash
