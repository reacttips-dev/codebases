import React from "react"

export const ThemesIcon = ({ width = 32, height = 32, ...rest }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <rect x="3" y="6" width="12" height="12" fill="white" />
    <path
      d="M23.0859 21H17.2002L20.1431 15.8113L23.0859 10.7L26.1062 15.8113L29.0491 21H23.0859Z"
      fill="#F1DEFA"
      stroke="#663399"
      strokeWidth="1.5"
    />
    <circle
      cx="15.25"
      cy="19.25"
      r="6.75"
      fill="#F06200"
      stroke="#F06200"
      strokeWidth="1.5"
    />
    <rect
      x="4.75"
      y="8.75"
      width="9.5"
      height="9.5"
      stroke="#663399"
      strokeWidth="1.5"
    />
  </svg>
)
