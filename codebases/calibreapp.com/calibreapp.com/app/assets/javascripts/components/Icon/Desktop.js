import React from 'react'

const Desktop = ({ height, width }) => (
  <svg width={width} height={height} viewBox="0 0 16 16" fill="none">
    <rect
      x="1"
      y="1"
      width="14"
      height="11"
      stroke="currentColor"
      strokeWidth="2"
    />
    <line
      x1="4"
      y1="15"
      x2="12"
      y2="15"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
)

Desktop.defaultProps = {
  height: '16px',
  width: '16px'
}

export default Desktop
