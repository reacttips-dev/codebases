import React from "react"

export const TutorialIcon = ({ width = 32, height = 32, ...rest }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M21.1744 24.3209H17.2006L19.1875 20.8177L21.1744 17.3667L23.2136 20.8177L25.2006 24.3209H21.1744Z"
      fill="#F67300"
      stroke="#F67300"
      strokeWidth="1.125"
    />
    <ellipse
      cx="15.1666"
      cy="9.83331"
      rx="4"
      ry="4"
      fill="#663399"
      stroke="#663399"
      strokeWidth="1.125"
    />
    <rect
      x="5.89587"
      y="16.5625"
      width="8.20833"
      height="8.20833"
      stroke="#663399"
      strokeWidth="1.125"
    />
  </svg>
)
