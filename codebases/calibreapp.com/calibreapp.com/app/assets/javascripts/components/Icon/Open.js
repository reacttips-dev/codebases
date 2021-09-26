import React from 'react'

import StyledIcon from './'

const Open = props => (
  <StyledIcon {...props}>
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#openIconClip0)">
        <path
          d="M13.125 10V13.125H0.875V0.75H4"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M6 0.75H13.125M13.125 0.75V8M13.125 0.75L4.375 9.5"
          stroke="currentColor"
          strokeWidth="2"
        />
      </g>
      <defs>
        <clipPath id="openIconClip0">
          <rect width="14" height="14" fill="white" />
        </clipPath>
      </defs>
    </svg>
  </StyledIcon>
)

export default Open
