import React from "react"

export const GatsbyCloudHostingIcon = ({
  height = 16,
  width = 16,
  ...rest
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <circle cx="7.9999" cy="8.00002" r="1.6" fill="currentColor" />
      <circle
        cx="8.0002"
        cy="8.00001"
        r="4.05"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}
