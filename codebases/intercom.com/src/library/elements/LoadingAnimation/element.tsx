import React from 'react'

interface IProps {
  strokeWidth?: number
  size?: number
}

export const LoadingAnimation = ({ strokeWidth = 5, size = 24 }: IProps) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="-13 -13 26 26"
        className="loading-animation"
        focusable="false"
        fill="none"
        aria-hidden="true"
      >
        <circle x="0" y="0" r="10" stroke="currentColor" strokeWidth={strokeWidth} opacity="0.5" />
        <path
          d="M 0 10 A 10 10 0 0 0 10 0"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </svg>
      <style jsx>{`
        .loading-animation {
          animation: load 1.2s infinite linear;
        }

        @keyframes load {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  )
}
