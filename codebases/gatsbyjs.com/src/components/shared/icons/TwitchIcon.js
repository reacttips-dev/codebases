import React from "react"

export const TwitchIcon = ({ height = 16, width = 16, ...rest }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 15 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.7352 8.48935L11.4489 10.7755H7.85752L5.8983 12.7344V10.7755H2.95956V1.30609H13.7352V8.48935ZM1.65296 9.53674e-07L1 2.61235V14.367H3.93908V16H5.57124L7.2044 14.367H9.81624L15.0406 9.14331V9.53674e-07H1.65296Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.55078 7.83691H7.85687V3.91797H6.55078V7.83691ZM10.1423 7.83691H11.4484V3.91797H10.1423V7.83691Z"
        fill="currentColor"
      />
    </svg>
  )
}
