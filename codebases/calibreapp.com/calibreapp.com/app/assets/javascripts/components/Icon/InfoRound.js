import React from 'react'

import StyledIcon from './'

const InfoRound = ({ width, height, color, ...props }) => (
  <StyledIcon width={width} height={height} color={color} {...props}>
    <svg width={width} height={height} viewBox="0 0 512 512">
      <path
        d="M248,64C146.39,64,64,146.39,64,248s82.39,184,184,184,184-82.39,184-184S349.61,64,248,64Z"
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth="32px"
      />
      <polyline
        points="220 220 252 220 252 336"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32px"
      />
      <line
        x1="208"
        y1="340"
        x2="296"
        y2="340"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="32px"
      />
      <path
        fill="currentColor"
        d="M248,130a26,26,0,1,0,26,26A26,26,0,0,0,248,130Z"
      />
    </svg>
  </StyledIcon>
)

InfoRound.defaultProps = {
  width: 20,
  height: 20
}

export default InfoRound
