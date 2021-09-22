import React from "react"

export const UnionIcon = ({ width = 32, height = 32, ...rest }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <circle
      cx="13"
      cy="16"
      r="9.25"
      fill="#F1DEFA"
      stroke="#663399"
      strokeWidth="1.5"
    />
    <circle cx="21" cy="16" r="8" fill="white" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19.2487 23.8077C21.5356 21.9751 23 19.1586 23 16C23 12.8414 21.5356 10.0249 19.2487 8.19227C15.6728 8.99085 13 12.1833 13 16C13 19.8167 15.6728 23.0091 19.2487 23.8077Z"
      fill="#F06200"
    />
    <line x1="15.3594" y1="12" x2="20.6719" y2="12" stroke="white" />
    <line x1="14.0312" y1="14" x2="22" y2="14" stroke="white" />
    <line x1="14.0312" y1="16" x2="22" y2="16" stroke="white" />
    <line x1="14.0312" y1="18" x2="22" y2="18" stroke="white" />
    <line x1="15.3594" y1="20" x2="20.6719" y2="20" stroke="white" />
    <circle cx="13" cy="16" r="9.25" stroke="#663399" strokeWidth="1.5" />
    <circle cx="21" cy="16" r="7.25" stroke="#663399" strokeWidth="1.5" />
    <mask
      id="mask0"
      masktype="alpha"
      maskUnits="userSpaceOnUse"
      x="13"
      y="8"
      width="16"
      height="16"
    >
      <circle cx="21" cy="16" r="7.25" stroke="#663399" strokeWidth="1.5" />
    </mask>
    <g mask="url(#mask0)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.2487 23.8077C21.5356 21.9751 23 19.1586 23 16C23 12.8414 21.5356 10.0249 19.2487 8.19227C15.6728 8.99085 13 12.1833 13 16C13 19.8167 15.6728 23.0091 19.2487 23.8077Z"
        fill="#F06200"
      />
    </g>
  </svg>
)
