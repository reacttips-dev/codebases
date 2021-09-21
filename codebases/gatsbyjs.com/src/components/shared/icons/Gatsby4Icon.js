import React from "react"
import { generateId } from "../../shared/helpers"

export const Gatsby4Icon = ({ height = 16, width = 16, ...rest }) => {
  const clip1Id = generateId()
  const clip2Id = generateId()
  const mask1Id = generateId()
  const gradient1Id = generateId()
  const gradient2Id = generateId()
  const gradient3Id = generateId()
  const gradient4Id = generateId()
  const gradient5Id = generateId()
  const gradient6Id = generateId()

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <g clipPath={`url(#${clip1Id})`}>
        <circle cx="18" cy="19" r="12" fill={`url(#${gradient1Id})`} />
        <circle cx="14.5" cy="15.5" r="12.5" fill={`url(#${gradient2Id})`} />
        <circle cx="18.5" cy="12.5" r="9.5" fill={`url(#${gradient3Id})`} />
        <circle cx="16" cy="14" r="8" fill={`url(#${gradient4Id})`} />
        <path
          d="M22.7245 -4.73609L1.95507 24.1214H19.0299V30.4121H22.7245V24.1214H26.8184V20.7264H22.7245V-4.73609ZM8.49543 20.7264L19.0299 5.99809V20.7264H8.49543Z"
          fill="white"
        />
        <path
          d="M22.7245 -4.73609H24.0558V-8.86506L21.6439 -5.51382L22.7245 -4.73609ZM1.95507 24.1214L0.874476 23.3437L-0.643492 25.4528H1.95507V24.1214ZM19.0299 24.1214H20.3613V22.79H19.0299V24.1214ZM19.0299 30.4121H17.6985V31.7435H19.0299V30.4121ZM22.7245 30.4121V31.7435H24.0558V30.4121H22.7245ZM22.7245 24.1214V22.79H21.3931V24.1214H22.7245ZM26.8184 24.1214V25.4528H28.1498V24.1214H26.8184ZM26.8184 20.7264H28.1498V19.395H26.8184V20.7264ZM22.7245 20.7264H21.3931V22.0578H22.7245V20.7264ZM8.49543 20.7264L7.41255 19.9518L5.90629 22.0578H8.49543V20.7264ZM19.0299 5.99809H20.3613V1.84817L17.947 5.22355L19.0299 5.99809ZM19.0299 20.7264V22.0578H20.3613V20.7264H19.0299ZM21.6439 -5.51382L0.874476 23.3437L3.03567 24.8991L23.8051 -3.95836L21.6439 -5.51382ZM1.95507 25.4528H19.0299V22.79H1.95507V25.4528ZM17.6985 24.1214V30.4121H20.3613V24.1214H17.6985ZM19.0299 31.7435H22.7245V29.0807H19.0299V31.7435ZM24.0558 30.4121V24.1214H21.3931V30.4121H24.0558ZM22.7245 25.4528H26.8184V22.79H22.7245V25.4528ZM28.1498 24.1214V20.7264H25.4871V24.1214H28.1498ZM26.8184 19.395H22.7245V22.0578H26.8184V19.395ZM24.0558 20.7264V-4.73609H21.3931V20.7264H24.0558ZM9.57832 21.5009L20.1128 6.77263L17.947 5.22355L7.41255 19.9518L9.57832 21.5009ZM17.6985 5.99809V20.7264H20.3613V5.99809H17.6985ZM19.0299 19.395H8.49543V22.0578H19.0299V19.395Z"
          fill="white"
        />
        <g clipPath={`url(#${clip2Id})`}>
          <mask
            id={mask1Id}
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="5"
            y="3"
            width="25"
            height="30"
          >
            <circle
              cx="11.7968"
              cy="8.52773"
              r="4.74257"
              fill={`url(#${gradient5Id})`}
            />
            <circle
              cx="9.79677"
              cy="17.5277"
              r="4.74257"
              fill={`url(#${gradient5Id})`}
            />
            <circle
              cx="18.0136"
              cy="18.7328"
              r="4.74257"
              fill={`url(#${gradient5Id})`}
            />
            <circle
              cx="24.9879"
              cy="19.848"
              r="4.74257"
              fill={`url(#${gradient5Id})`}
            />
            <circle
              cx="16.9879"
              cy="27.848"
              r="4.74257"
              fill={`url(#${gradient5Id})`}
            />
          </mask>
          <g mask={`url(#${mask1Id})`}>
            <path
              d="M16.9482 26.2104V31.7511V32.5011H17.6982H24.0555H24.8055V31.7511V26.2104H28.1495H28.8995V25.4604V19.4026V18.6526H28.1495H24.8055V-8.85742V-11.1834L23.4468 -9.29554L-1.25253 25.0223L-2.10765 26.2104H-0.643799H16.9482ZM16.9482 12.4934V18.6526H12.5428L16.9482 12.4934Z"
              stroke={`url(#${gradient6Id})`}
              strokeWidth="1.5"
            />
          </g>
        </g>
      </g>
      <defs>
        <radialGradient
          id={gradient1Id}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(18 19) rotate(90) scale(12)"
        >
          <stop stopColor="#047BD3" />
          <stop offset="1" stopColor="#047BD3" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id={gradient2Id}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(14.5 15.5) rotate(90) scale(12.5)"
        >
          <stop stopColor="#FF0D6A" />
          <stop offset="1" stopColor="#FF0D6A" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id={gradient3Id}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(18.5 12.5) rotate(90) scale(9.5)"
        >
          <stop stopColor="#8A4BAF" />
          <stop offset="0.515625" stopColor="#8A4BAF" stopOpacity="0.25" />
          <stop offset="1" stopColor="#8A4BAF" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id={gradient4Id}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(16 14) rotate(90) scale(8)"
        >
          <stop stopColor="#8A4BAF" />
          <stop offset="0.515625" stopColor="#8A4BAF" stopOpacity="0.25" />
          <stop offset="1" stopColor="#8A4BAF" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id={gradient5Id}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(11.7968 8.52773) rotate(90) scale(4.74257)"
        >
          <stop />
          <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id={gradient5Id}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(9.79677 17.5277) rotate(90) scale(4.74257)"
        >
          <stop />
          <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id={gradient5Id}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(18.0136 18.7328) rotate(90) scale(4.74257)"
        >
          <stop />
          <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id={gradient5Id}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(24.9879 19.848) rotate(90) scale(4.74257)"
        >
          <stop />
          <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id={gradient5Id}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(16.9879 27.848) rotate(90) scale(4.74257)"
        >
          <stop />
          <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <linearGradient
          id={gradient6Id}
          x1="13.7528"
          y1="-8.85742"
          x2="13.7528"
          y2="31.7511"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="0.572917" stopColor="#D459AB" />
          <stop offset="0.786458" stopColor="#047BD3" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <clipPath id={clip1Id}>
          <rect width="32" height="32" fill="white" />
        </clipPath>
        <clipPath id={clip2Id}>
          <rect
            width="29.7307"
            height="23.3143"
            fill="white"
            transform="translate(0 3.38867)"
          />
        </clipPath>
      </defs>
    </svg>
  )
}
