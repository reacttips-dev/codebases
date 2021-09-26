import React from 'react'

const Loading = ({ height, width }) => (
  <svg width={width} height={height} viewBox="0 0 38 38" stroke="currentColor">
    <g fill="none" fillRule="evenodd">
      <g transform="translate(1 1)" strokeWidth="2">
        <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
        <path d="M36 18c0-9.94-8.06-18-18-18">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 18 18"
            to="360 18 18"
            dur="1s"
            repeatCount="indefinite"
          />
        </path>
      </g>
    </g>
  </svg>
)

Loading.defaultProps = {
  height: '15px',
  width: '15px'
}

export default Loading
