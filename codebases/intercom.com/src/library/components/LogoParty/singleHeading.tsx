import classnames from 'classnames'
import { Text } from 'marketing-site/src/library/elements/Text'
import { VisuallyHidden } from 'marketing-site/src/library/elements/VisuallyHidden'
import magicStarImage from 'marketing-site/src/library/images/brand-magic-star-logo-pond.svg'
import magicTransitionImage from 'marketing-site/src/library/images/brand-magic-transition.svg'
import { HeadingStyle } from 'marketing-site/src/library/utils'
import React from 'react'
import { ISingleHeading } from './index'

export function SingleHeading(props: ISingleHeading) {
  const { heading, magicSparklesEffectEnabled, style } = props

  const spanClass = classnames({
    'heading-large': style === HeadingStyle.Large,
    'heading-small': style === HeadingStyle.Small,
    'heading-tiny': style === HeadingStyle.Tiny,
    'heading-with-sparkles': magicSparklesEffectEnabled,
  })

  const getHeadingTextSize = (style: HeadingStyle) => {
    switch (style) {
      case HeadingStyle.Tiny:
        return 'md+'

      case HeadingStyle.Small:
        return 'lg'

      case HeadingStyle.Large:
      default:
        return 'xxl+'
    }
  }

  return style === HeadingStyle.Hidden ? (
    <VisuallyHidden>
      <span>{heading}</span>
    </VisuallyHidden>
  ) : (
    <span className={spanClass}>
      <Text size={getHeadingTextSize(style)}>{heading}</Text>
      <style jsx>
        {`
          .heading-large {
            margin: 0 0 32px 0;
            display: block;
          }

          .heading-small {
            margin: 0 0 36px 0;
            font-weight: normal;
            display: block;
          }

          .heading-tiny {
            margin: 0 0 12px 0;
            display: block;
            line-clamp: 2;
          }

          .heading-with-sparkles:after {
            content: '';
            display: block;
            width: 290px;
            height: 269px;
            position: absolute;
            bottom: 80px;
            left: 0;
            background-image: url(${magicTransitionImage});
            background-size: cover;
          }

          .heading-with-sparkles:before {
            content: '';
            display: block;
            width: 53px;
            height: 54px;
            position: absolute;
            bottom: 125px;
            right: 0;
            background-image: url(${magicStarImage});
            background-size: cover;
          }

          @include media-query(tablet) {
            .heading-with-sparkles:after {
              left: 80px;
              bottom: 75px;
            }

            .heading-with-sparkles:before {
              bottom: 15px;
              right: -25px;
            }
          }

          @include media-query(desktop) {
            .heading-with-sparkles:before {
              right: 0;
            }
          }
        `}
      </style>
    </span>
  )
}
