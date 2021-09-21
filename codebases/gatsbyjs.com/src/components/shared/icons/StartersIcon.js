import React from "react"

export const StartersIcon = ({ width = 32, height = 32, ...rest }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M11.5 23H20.5C22.433 23 24 21.433 24 19.5V19.5C24 17.567 22.433 16 20.5 16H18"
      stroke="#7026B9"
      strokeWidth="1.5"
    />
    <path
      d="M18 9L11.5 9C9.567 9 8 10.567 8 12.5V12.5C8 14.433 9.567 16 11.5 16L13.5 16"
      stroke="#7026B9"
      strokeWidth="1.5"
    />
    <path
      d="M15.0003 11.8284L17.8287 9L15.0003 6.17157"
      stroke="#7026B9"
      strokeWidth="1.5"
    />
    <circle
      cx="9"
      cy="23"
      r="2.25"
      fill="#D9BAE8"
      stroke="#7026B9"
      strokeWidth="1.5"
    />
    <circle
      cx="16"
      cy="16"
      r="2.25"
      fill="#F06200"
      stroke="#F06200"
      strokeWidth="1.5"
    />
    <circle cx="23" cy="9" r="3" fill="#7026B9" />
  </svg>
)
