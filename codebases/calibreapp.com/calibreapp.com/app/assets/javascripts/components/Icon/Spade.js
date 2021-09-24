import React from 'react'

const Spade = ({ height, width }) => (
  <svg width={width} height={height} viewBox="0 0 19 20" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.01038 15.7193C5.40724 17.8318 7.99259 15.1388 7.99259 15.1388C7.06887 18.441 4.94427 19.0423 4.94427 19.0423L5.42403 20H9.05371H12.6834L13.1632 19.0423C13.1632 19.0423 11.0386 18.441 10.1148 15.1388C10.1148 15.1388 12.7002 17.8318 16.0971 15.7193C19.4939 13.6068 19.4577 5.40645 9.05364 0C-1.3503 5.40653 -1.38647 13.6068 2.01038 15.7193Z"
      fill="currentColor"
    ></path>
  </svg>
)

Spade.defaultProps = {
  height: '20px',
  width: '19px'
}

export default Spade
