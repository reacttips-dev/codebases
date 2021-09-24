import React from 'react'

import StyledIcon from './'

const Customise = ({ height, width, ...props }) => (
  <StyledIcon width={width} height={height} {...props}>
    <svg width={width} height={height} viewBox="0 0 16 16" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 0H7V2.08296C6.08835 2.23591 5.2464 2.59444 4.52347 3.10925L3.05026 1.63604L1.63605 3.05025L3.10925 4.52346C2.59444 5.2464 2.23591 6.08834 2.08296 7H0V9H2.08296C2.23591 9.91165 2.59444 10.7536 3.10925 11.4765L1.63603 12.9497L3.05024 14.364L4.52346 12.8907C5.24639 13.4056 6.08834 13.7641 7 13.917V16H9V13.917C9.91166 13.7641 10.7536 13.4056 11.4765 12.8907L12.9498 14.364L14.364 12.9497L12.8907 11.4765C13.4056 10.7536 13.7641 9.91166 13.917 9H16V7H13.917C13.7641 6.08834 13.4056 5.24639 12.8907 4.52346L14.364 3.05025L12.9497 1.63604L11.4765 3.10925C10.7536 2.59444 9.91165 2.23591 9 2.08296V0ZM8 12C10.2091 12 12 10.2091 12 8C12 5.79086 10.2091 4 8 4C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12Z"
        fill="currentColor"
      />
    </svg>
  </StyledIcon>
)

Customise.defaultProps = {
  height: '16px',
  width: '16px'
}

export default Customise
