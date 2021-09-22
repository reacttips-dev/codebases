import React from "react"
import { generateId } from "../../shared/helpers"

export const GatsbyCloudBuildsIcon = ({ height = 16, width = 16, ...rest }) => {
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
        x="1"
        y="0"
        width="14"
        height="16"
      >
        <path
          d="M7.9282 0.777778L14.1828 4.38889L14.1828 11.6111L7.92821 15.2222L1.67358 11.6111L1.67358 4.38889L7.9282 0.777778Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </mask>
      <g mask={`url(#${maskId})`}>
        <path
          d="M7.9282 0.777778L14.1828 4.38889L14.1828 11.6111L7.92821 15.2222L1.67358 11.6111L1.67358 4.38889L7.9282 0.777778Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M1.00244 4.00043L7.92695 8.00043L14.8558 3.99994"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle
          r="8"
          transform="matrix(-1 7.74287e-08 7.74287e-08 1 7.93408 16.0713)"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle
          r="5.33333"
          transform="matrix(-1 7.74287e-08 7.74287e-08 1 7.93424 16.0713)"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  )
}
