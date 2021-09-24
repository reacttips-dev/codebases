import React from 'react'

const Mobile = ({ height, width }) => (
  <svg width={width} height={height} viewBox="0 0 13 16" fill="none">
    <path d="M1 1H12V15H1V1Z" stroke="currentColor" strokeWidth="2" />
    <circle cx="6.5" cy="12" r="1" fill="currentColor" />
  </svg>
)

Mobile.defaultProps = {
  height: '16px',
  width: '13px',
}

export default Mobile
