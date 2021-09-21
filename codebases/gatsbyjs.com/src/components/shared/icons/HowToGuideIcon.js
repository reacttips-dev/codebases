import React from "react"

export const HowToGuideIcon = ({ width = 32, height = 32, ...rest }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M10.5 9H20C21.6569 9 23 10.3431 23 12V12C23 13.6569 21.6569 15 20 15H12"
      stroke="#663399"
      strokeWidth="1.5"
    />
    <path
      d="M15 21L10 21C8.34315 21 7 19.6569 7 18V18C7 16.3431 8.34315 15 10 15L13.5 15"
      stroke="#663399"
      strokeWidth="1.5"
    />
    <path
      d="M13.0003 18.1716L15.8287 21L13.0003 23.8284"
      stroke="#663399"
      strokeWidth="1.5"
    />
    <circle r="3" transform="matrix(1 0 0 -1 9 9)" fill="#00BDB6" />
    <circle r="3" transform="matrix(1 0 0 -1 21 21)" fill="#663399" />
  </svg>
)
