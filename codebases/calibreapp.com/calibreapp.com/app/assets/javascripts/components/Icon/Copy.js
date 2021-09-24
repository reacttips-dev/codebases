import React from 'react'

import StyledIcon from './'

const Copy = props => (
  <StyledIcon {...props}>
    <svg viewBox="0 0 14 15" fill="none">
      <rect x="1" y="1" width="8" height="8" stroke="#3057F4" strokeWidth="2" />
      <rect
        x="5"
        y="6"
        width="8"
        height="8"
        fill="white"
        stroke="#3057F4"
        strokeWidth="2"
      />
    </svg>
  </StyledIcon>
)

Copy.defaultProps = {
  height: '15px',
  width: '14px'
}

export default Copy
