import React from "react"

export const BigChevronLeftIcon = ({ width = 35, height = 98, ...rest }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 35 98"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M34 1L2 49L34 97"
      stroke="#D9D7E0"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

export const BigChevronRightIcon = ({ width = 35, height = 98, ...rest }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 35 98"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M1 1L33 49L1 97"
      stroke="#D9D7E0"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)
