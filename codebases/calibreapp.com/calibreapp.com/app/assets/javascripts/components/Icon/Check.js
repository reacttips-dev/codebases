import React from 'react'

import StyledIcon from './'

const Check = ({ width, height, color, ...props }) => (
  <StyledIcon width={width} height={height} color={color} {...props}>
    <svg
      width={width}
      height={height}
      viewBox="0 0 14 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.08337 4.58333L6.42674 9L12.4653 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
      />
    </svg>
  </StyledIcon>
)

Check.defaultProps = {
  width: 14,
  height: 11
}

export default Check
