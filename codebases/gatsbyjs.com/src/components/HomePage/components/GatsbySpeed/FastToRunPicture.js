import React from "react"
import { keyframes } from "@emotion/core"

const contentEntry = keyframes`
  to {
     opacity: 1;
     transform: translateY(0)
  }
`

const presentationCss = ({ activeStep }) => ({
  ".initial-content": {
    animation: `${contentEntry} 500ms ease forwards`,
    display: activeStep > 0 ? `block` : `none`,
    opacity: 0,
    transform: `translateY(50px)`,
  },
  ".client-content": {
    animation: `${contentEntry} 250ms ease forwards`,
    display: activeStep > 1 ? `block` : `none`,
    opacity: 0,
    transform: `translateY(-30px)`,
  },
})

export const FastToRunPicture = ({ activeStep }) => {
  const svgRef = React.useRef()

  const prepareClientContent = () => {
    const svg = svgRef.current
    const items = Array.from(svg.querySelectorAll(`.client-content`))

    items.map((item, idx) => {
      return (item.style.animationDelay = `${idx * 200}ms`)
    })
  }

  React.useEffect(() => {
    prepareClientContent()
  }, [])

  return (
    <svg
      ref={svgRef}
      width="356"
      height="616"
      viewBox="0 0 356 616"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      css={presentationCss({ activeStep })}
    >
      <g filter="url(#filter0_dd)">
        <rect x="48" y="32" width="266" height="520" rx="40" fill="#fff" />
      </g>
      <g className="initial-content">
        <rect x="89" y="298" width="72" height="8" rx="2" fill="#F5F5F5" />
        <rect x="99" y="310" width="24" height="4" rx="1" fill="#F5F5F5" />
        <rect x="89" y="310" width="8" height="4" rx="1" fill="#F5F5F5" />
        <rect x="89" y="316" width="24" height="4" rx="1" fill="#F5F5F5" />
        <rect x="115" y="316" width="14" height="4" rx="1" fill="#F5F5F5" />
        <rect x="125" y="310" width="14" height="4" rx="1" fill="#F5F5F5" />
        <rect x="89" y="322" width="32" height="4" rx="1" fill="#F5F5F5" />
        <mask
          id="a"
          maskUnits="userSpaceOnUse"
          x="89"
          y="236"
          width="72"
          height="54"
        >
          <path
            d="M161 286a4 4 0 01-4 4H93a4 4 0 01-4-4v-46a4 4 0 014-4h64a4 4 0 014 4v46z"
            fill="#fff"
          />
        </mask>
        <g mask="url(#a)">
          <path d="M161 290H89v-54h72v54z" fill="#F0F0F2" />
          <path
            d="M171.4 294.4l-27-26.5-9.5 8.8-24.7-24.3-50 49.1 50 49.1 31.9-31.4 2.3 1.8 27-26.6z"
            fill="#000"
            fillOpacity=".1"
          />
        </g>
        <g>
          <circle cx="153" cy="318" r="8" fill="#F5F5F5" />
          <path
            d="M153 313.6l-.8.7 3.1 3.1h-6.7v1.2h6.7l-3 3 .7.8 4.4-4.4-4.4-4.4z"
            fill="#fff"
          />
        </g>
        <g>
          <rect x="89" y="432" width="72" height="8" rx="2" fill="#F5F5F5" />
          <rect x="99" y="444" width="24" height="4" rx="1" fill="#F5F5F5" />
          <rect x="89" y="444" width="8" height="4" rx="1" fill="#F5F5F5" />
          <rect x="89" y="450" width="24" height="4" rx="1" fill="#F5F5F5" />
          <rect x="115" y="450" width="14" height="4" rx="1" fill="#F5F5F5" />
          <rect x="125" y="444" width="14" height="4" rx="1" fill="#F5F5F5" />
          <rect x="89" y="456" width="32" height="4" rx="1" fill="#F5F5F5" />
          <mask
            id="b"
            maskUnits="userSpaceOnUse"
            x="89"
            y="370"
            width="72"
            height="54"
          >
            <path
              d="M161 420a4 4 0 01-4 4H93a4 4 0 01-4-4v-46a4 4 0 014-4h64a4 4 0 014 4v46z"
              fill="#fff"
            />
          </mask>
          <g mask="url(#b)">
            <path d="M161 424H89v-54h72v54z" fill="#F0F0F2" />
            <path
              d="M171.4 428.4l-27-26.5-9.5 8.8-24.7-24.3-50 49.1 50 49.1 31.9-31.4 2.3 1.8 27-26.6z"
              fill="#000"
              fillOpacity=".1"
            />
          </g>
          <g>
            <circle cx="153" cy="452" r="8" fill="#F5F5F5" />
            <path
              d="M153 447.6l-.8.7 3.1 3.1h-6.7v1.2h6.7l-3 3 .7.8 4.4-4.4-4.4-4.4z"
              fill="#fff"
            />
          </g>
        </g>
        <g>
          <rect x="201" y="298" width="72" height="8" rx="2" fill="#F5F5F5" />
          <rect x="211" y="310" width="24" height="4" rx="1" fill="#F5F5F5" />
          <rect x="201" y="310" width="8" height="4" rx="1" fill="#F5F5F5" />
          <rect x="201" y="316" width="24" height="4" rx="1" fill="#F5F5F5" />
          <rect x="227" y="316" width="14" height="4" rx="1" fill="#F5F5F5" />
          <rect x="237" y="310" width="14" height="4" rx="1" fill="#F5F5F5" />
          <rect x="201" y="322" width="32" height="4" rx="1" fill="#F5F5F5" />
          <mask
            id="c"
            maskUnits="userSpaceOnUse"
            x="201"
            y="236"
            width="72"
            height="54"
          >
            <path
              d="M273 286a4 4 0 01-4 4h-64a4 4 0 01-4-4v-46a4 4 0 014-4h64a4 4 0 014 4v46z"
              fill="#fff"
            />
          </mask>
          <g mask="url(#c)">
            <path d="M273 290h-72v-54h72v54z" fill="#F0F0F2" />
            <path
              d="M283.4 294.4l-27-26.5-9.5 8.8-24.7-24.3-50 49.1 50 49.1 32-31.4 2.2 1.8 27-26.6z"
              fill="#000"
              fillOpacity=".1"
            />
          </g>
          <g>
            <circle cx="265" cy="318" r="8" fill="#F5F5F5" />
            <path
              d="M265 313.6l-.8.7 3.1 3.1h-6.7v1.2h6.7l-3 3 .7.8 4.4-4.4-4.4-4.4z"
              fill="#fff"
            />
          </g>
        </g>
        <g>
          <rect x="201" y="432" width="72" height="8" rx="2" fill="#F5F5F5" />
          <rect x="211" y="444" width="24" height="4" rx="1" fill="#F5F5F5" />
          <rect x="201" y="444" width="8" height="4" rx="1" fill="#F5F5F5" />
          <rect x="201" y="450" width="24" height="4" rx="1" fill="#F5F5F5" />
          <rect x="227" y="450" width="14" height="4" rx="1" fill="#F5F5F5" />
          <rect x="237" y="444" width="14" height="4" rx="1" fill="#F5F5F5" />
          <rect x="201" y="456" width="32" height="4" rx="1" fill="#F5F5F5" />
          <mask
            id="d"
            maskUnits="userSpaceOnUse"
            x="201"
            y="370"
            width="72"
            height="54"
          >
            <path
              d="M273 420a4 4 0 01-4 4h-64a4 4 0 01-4-4v-46a4 4 0 014-4h64a4 4 0 014 4v46z"
              fill="#fff"
            />
          </mask>
          <g mask="url(#d)">
            <path d="M273 424h-72v-54h72v54z" fill="#F0F0F2" />
            <path
              d="M283.4 428.4l-27-26.5-9.5 8.8-24.7-24.3-50 49.1 50 49.1 32-31.4 2.2 1.8 27-26.6z"
              fill="#000"
              fillOpacity=".1"
            />
          </g>
          <g>
            <circle cx="265" cy="452" r="8" fill="#F5F5F5" />
            <path
              d="M265 447.6l-.8.7 3.1 3.1h-6.7v1.2h6.7l-3 3 .7.8 4.4-4.4-4.4-4.4z"
              fill="#fff"
            />
          </g>
        </g>
        <rect x="123" y="162" width="120" height="20" rx="10" fill="#F0F0F2" />
        <g fill="#F0F0F2" className="initial-content">
          <rect x="72" y="110" width="99" height="16" rx="2" />
          <rect x="83" y="130" width="54" height="16" rx="2" />
          <rect x="176" y="110" width="69" height="16" rx="2" />
          <rect x="143" y="130" width="34" height="16" rx="2" />
          <rect x="250" y="110" width="40" height="16" rx="2" />
          <rect x="183" y="130" width="94" height="16" rx="2" />
        </g>
        <circle cx="82" cy="66" r="10" fill="#F0F0F2" />
        <g fill="#F0F0F2">
          <rect x="273" y="60" width="16.7" height="2.5" rx="1" />
          <rect x="273" y="65" width="16.7" height="2.5" rx="1" />
          <rect x="273" y="70" width="16.7" height="2.5" rx="1" />
        </g>
        <g>
          <path
            d="M252 57.7a8.3 8.3 0 100 16.6 8.3 8.3 0 000-16.6zm0 2.5a2.5 2.5 0 110 5 2.5 2.5 0 010-5zm0 11.8c-2 0-4-1-5-2.7 0-1.6 3.3-2.5 5-2.5 1.7 0 5 .9 5 2.5a6 6 0 01-5 2.7z"
            fill="#37B635"
            className="client-content"
          />
          <mask
            id="e"
            maskUnits="userSpaceOnUse"
            x="123"
            y="162"
            width="120"
            height="20"
          >
            <rect
              x="123"
              y="162"
              width="120"
              height="20"
              rx="10"
              fill="#F0F0F2"
            />
          </mask>
          <g mask="url(#e)" className="client-content">
            <path fill="#37B635" d="M123 162h120v20H123z" />
          </g>
          <path
            d="M178 178.6l1.9-5.3-3-1 7.3-6.8-2 5.3 3 1-7.3 6.8z"
            fill="#fff"
          />
          <mask
            id="f"
            maskUnits="userSpaceOnUse"
            x="145"
            y="310"
            width="16"
            height="16"
          >
            <circle cx="153" cy="318" r="8" fill="#F5F5F5" />
          </mask>
          <g mask="url(#f)" className="client-content">
            <circle cx="153" cy="318" r="8" fill="#F5F5F5" />
            <path fill="#37B635" d="M145 310h16v16h-16z" />
            <path
              d="M150.3 323.8l1.7-4.7-2.6-.9 6.4-6-1.7 4.8 2.5.9-6.3 6z"
              fill="#fff"
            />
          </g>
          <mask
            id="g"
            maskUnits="userSpaceOnUse"
            x="257"
            y="310"
            width="16"
            height="16"
          >
            <circle cx="265" cy="318" r="8" fill="#F5F5F5" />
          </mask>
          <g mask="url(#g)" className="client-content">
            <circle cx="265" cy="318" r="8" fill="#F5F5F5" />
            <path fill="#37B635" d="M257 310h16v16h-16z" />
            <path
              d="M262.3 323.8l1.7-4.7-2.6-.9 6.4-6-1.7 4.8 2.5.9-6.3 6z"
              fill="#fff"
            />
          </g>
          <g>
            <mask
              id="h"
              maskUnits="userSpaceOnUse"
              x="145"
              y="444"
              width="16"
              height="16"
            >
              <circle cx="153" cy="452" r="8" fill="#F5F5F5" />
            </mask>
            <g mask="url(#h)" className="client-content">
              <circle cx="153" cy="452" r="8" fill="#F5F5F5" />
              <path fill="#37B635" d="M145 444h16v16h-16z" />
              <path
                d="M150.3 457.8l1.7-4.7-2.6-.9 6.4-6-1.7 4.8 2.5.9-6.3 6z"
                fill="#fff"
              />
            </g>
          </g>
          <g className="client-content">
            <mask
              id="i"
              maskUnits="userSpaceOnUse"
              x="257"
              y="444"
              width="16"
              height="16"
            >
              <circle cx="265" cy="452" r="8" fill="#F5F5F5" />
            </mask>
            <g mask="url(#i)">
              <circle cx="265" cy="452" r="8" fill="#F5F5F5" />
              <path fill="#37B635" d="M257 444h16v16h-16z" />
              <path
                d="M262.3 457.8l1.7-4.7-2.6-.9 6.4-6-1.7 4.8 2.5.9-6.3 6z"
                fill="#fff"
              />
            </g>
          </g>
          <g className="client-content">
            <path
              d="M48 504h266v8c0 22-18 40-40 40H88c-22 0-40-18-40-40v-8z"
              fill="#37B635"
            />
            <path
              d="M239 534a2 2 0 100 4 2 2 0 000-4zm-6-16v2h2l3.6 7.6-1.3 2.4a2 2 0 001.8 3h11.9v-2h-11.6a.2.2 0 01-.2-.3l.9-1.7h7.5a2 2 0 001.7-1l3.6-6.5.1-.5c0-.5-.4-1-1-1h-14.8l-1-2H233zm16 16a2 2 0 100 4 2 2 0 000-4z"
              fill="#fff"
            />
            <circle cx="280" cy="528" r="10" fill="#fff" />
            <path
              d="M280 522.4l-1 1 3.9 3.9h-8.5v1.4h8.5l-3.9 3.9 1 1 5.6-5.6-5.6-5.6z"
              fill="#37B635"
            />
          </g>
          <path
            d="M259.7 255.2l-1-.8c-3.4-3.2-5.7-5.2-5.7-7.7 0-2 1.6-3.7 3.7-3.7a4 4 0 013 1.4 4 4 0 013-1.4c2 0 3.6 1.6 3.6 3.7 0 2.5-2.2 4.5-5.7 7.7l-1 .8z"
            fill="#37B635"
            className="client-content"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_dd"
          x="0"
          y="0"
          width="362"
          height="616"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="8" />
          <feGaussianBlur stdDeviation="8" />
          <feColorMatrix values="0 0 0 0 0.18 0 0 0 0 0.16 0 0 0 0 0.2 0 0 0 0.04 0" />
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feColorMatrix
            in="SourceAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="16" />
          <feGaussianBlur stdDeviation="24" />
          <feColorMatrix values="0 0 0 0 0.278823 0 0 0 0 0.247843 0 0 0 0 0.309804 0 0 0 0.16 0" />
          <feBlend in2="effect1_dropShadow" result="effect2_dropShadow" />
          <feBlend in="SourceGraphic" in2="effect2_dropShadow" result="shape" />
        </filter>
      </defs>
    </svg>
  )
}
