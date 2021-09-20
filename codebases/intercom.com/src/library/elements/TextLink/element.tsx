import React from 'react'
import { IProps } from './index'

export const TextLink = ({ url, children, newWindow = true }: IProps) => {
  return (
    <a href={url} target={newWindow ? '_blank' : ''} rel={newWindow ? 'noopener' : ''}>
      {children}
      <style jsx>
        {`
          a {
            display: inline;
            color: inherit;
            text-decoration: none;
            border-bottom: 1px solid;
          }

          a:hover,
          a:focus {
            outline: none;
          }
        `}
      </style>
    </a>
  )
}
