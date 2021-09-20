import React from 'react'
import { IProps } from './index'

export const Chevron = ({ small, large }: IProps) => {
  if (large) {
    return (
      <svg
        focusable="false"
        style={{ display: 'block' }}
        width="20"
        height="12"
        viewBox="0 0 20 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.2 1.24072L10 10.2037L18.8 1.24072"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return small ? (
    <svg
      focusable="false"
      style={{ display: 'block' }}
      width="8"
      height="6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill="#F4F4F4" d="M-1327-207H113v2742h-1440z" />
      <path fill="#fff" d="M-1327-207H113v829h-1440z" />
      <path fill="#fff" d="M-1327-29H113v130h-1440z" />
      <path d="M1 1.433l3 3 3-3" stroke="#000" />
    </svg>
  ) : (
    <svg
      focusable="false"
      style={{ display: 'block' }}
      width="10"
      height="6"
      viewBox="0 0 10 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 1l4 4 4-4"
        stroke="#000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
