import { Text } from 'marketing-site/src/library/elements/Text'
import React from 'react'
import { IHeadingsPair } from './index'

export function HeadingsPair(props: IHeadingsPair) {
  const { largeHeading, smallHeading } = props

  return (
    <>
      <span className="heading-large">
        <Text size="xxl+">{largeHeading}</Text>
      </span>
      <div className="heading-small-wrapper">
        <span className="heading-small">
          <Text size="lg">{smallHeading}</Text>
        </span>
      </div>
      <style jsx>
        {`
          .heading-large {
            margin: 0;
            display: block;
          }

          .heading-small {
            margin: 24px 0 0 0;
            display: block;
          }

          .heading-small-wrapper {
            max-width: 820px;
            margin: 0 auto 36px;
            position: relative;
          }
        `}
      </style>
    </>
  )
}
