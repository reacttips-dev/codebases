import React from "react"
import { generateId } from "../../shared/helpers"

export const GatsbyCloudIntegrationsIcon = ({
  height = 16,
  width = 16,
  ...rest
}) => {
  const maskId = generateId()

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <mask
        id={maskId}
        mask-type="alpha"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="16"
        height="16"
      >
        <circle cx="8" cy="8" r="8" fill="#C4C4C4" />
      </mask>
      <g mask={`url(#${maskId})`}>
        <circle
          cx="7.9999"
          cy="8.00002"
          r="1.6"
          fill="#232129"
          fillOpacity="0.7"
        />
        <circle
          cx="-0.125"
          cy="18"
          r="8.75"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle
          cx="-0.124902"
          cy="18"
          r="5.65"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle
          cx="4.125"
          cy="-4.25"
          r="8.75"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle
          cx="4.1251"
          cy="-4.24996"
          r="5.65"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle
          r="8.75"
          transform="matrix(-1 0 0 1 19.875 12.5)"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle
          r="5.65"
          transform="matrix(-1 0 0 1 19.8749 12.5)"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle
          cx="7.925"
          cy="8.05"
          r="4.05"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle
          cx="8"
          cy="8"
          r="7.25"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  )
}
