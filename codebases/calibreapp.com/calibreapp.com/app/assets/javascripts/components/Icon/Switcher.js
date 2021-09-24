import React from 'react'

const Switcher = ({ height, width }) => (
  <svg width={width} height={height} fill="none">
    <rect x=".5" y=".5" width="19" height="19" rx="2.5" stroke="#90A5F9"></rect>
    <g>
      <path
        d="M5 8l4.867 5.133L15 8"
        stroke="#90A5F9"
        strokeWidth="2"
        strokeLinecap="square"
      ></path>
    </g>
    <defs></defs>
  </svg>
)

Switcher.defaultProps = {
  height: '20px',
  width: '20px'
}

export default Switcher
