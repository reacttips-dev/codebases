import React from 'react'
import { IProps } from './index'

export function IDLink({ id, offsetFromTop }: IProps) {
  return (
    <section id={id} data-testid={`id-link-${id}`}>
      <style jsx>
        {`
          section {
            scroll-margin-top: ${offsetFromTop || 60}px;
          }
        `}
      </style>
    </section>
  )
}
