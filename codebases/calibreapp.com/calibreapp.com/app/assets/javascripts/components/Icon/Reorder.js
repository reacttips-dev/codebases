import React from 'react'

import StyledIcon from './'

const Reorder = props => (
  <StyledIcon {...props}>
    <svg viewBox="0 0 14 15" fill="none">
      <path d="M0 4H14" stroke="currentColor" strokeWidth="2" />
      <path d="M0 8H14" stroke="currentColor" strokeWidth="2" />
      <path d="M0 12H14" stroke="currentColor" strokeWidth="2" />
    </svg>
  </StyledIcon>
)

Reorder.defaultProps = {
  height: '15px',
  width: '14px'
}

export default Reorder
