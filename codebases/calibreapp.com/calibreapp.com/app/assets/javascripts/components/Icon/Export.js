import React from 'react'

const Export = ({ height, width }) => (
  <svg width={width} height={height} viewBox="0 0 14 16" fill="none">
    <path
      d="M6.86667 10.6333L2 5.5M6.86667 10.6333L12 5.5M6.86667 10.6333V1"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
    />
    <line y1="15" x2="14" y2="15" stroke="currentColor" strokeWidth="2" />
  </svg>
)

Export.defaultProps = {
  height: '16px',
  width: '14px'
}

export default Export
