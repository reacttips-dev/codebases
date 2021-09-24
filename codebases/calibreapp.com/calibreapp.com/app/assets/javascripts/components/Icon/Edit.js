import React from 'react'

import StyledIcon from './'

const Edit = props => (
  <StyledIcon {...props}>
    <svg viewBox="0 0 15 15" fill="none">
      <path
        d="M6.18731 4.51289L9.2002 1.5L13.4428 5.74264L10.4299 8.75553M6.18731 4.51289L1.82169 8.8785L1.25564 13.3544L6.06433 13.1211L10.4299 8.75553M6.18731 4.51289L10.4299 8.75553"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  </StyledIcon>
)

Edit.defaultProps = {
  height: '15px',
  width: '15px'
}

export default Edit
