import React from 'react'

import StyledIcon from './'

const Delete = props => (
  <StyledIcon {...props}>
    <svg viewBox="0 0 14 16" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 0V2H3H2H0V4H2V15V16H3H11H12V15V4H14V2H12H11H10V0H4ZM4 14V4H6V14H4ZM8 14V4H10V14H8Z"
        fill="currentColor"
      />
    </svg>
  </StyledIcon>
)

Delete.defaultProps = {
  height: '16px',
  width: '14px'
}

export default Delete
