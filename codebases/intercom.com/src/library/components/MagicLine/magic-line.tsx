import React from 'react'
import { IProps } from './index'
import { getMagicLineTexture, getMagicLineProps } from './image-props'

import { mq } from 'marketing-site/src/library/utils'

const getProportionalSize = (designSize: number, designViewport: number) =>
  `100vw * ${designSize} / ${designViewport}`

export function MagicLine({ texture = '4', ...config }: IProps) {
  const magicLineTexture = getMagicLineTexture(texture)

  const {
    showInMobile,
    topOverlappingSize,
    bottomOverlappingSize,
    position,
    flipHorizontally,
    mobileTopOverlappingSize,
    mobileBottomOverlappingSize,
    containerHeight,
    containerMobileHeight,
    minWidth,
    minHeight,
  } = getMagicLineProps(magicLineTexture, config)

  const mobileDisplay = showInMobile ? 'block' : 'none'

  const width = getProportionalSize(magicLineTexture.width, magicLineTexture.designViewport)
  const height = getProportionalSize(magicLineTexture.height, magicLineTexture.designViewport)

  const overlappingDifference = `${bottomOverlappingSize} - ${topOverlappingSize}`
  const mobileOverlappingDifference = `${mobileBottomOverlappingSize} - ${mobileTopOverlappingSize}`

  const flip = flipHorizontally ? `scaleX(-1)` : 'none'

  const oppositePosition = position === 'right' ? 'left' : 'right'

  return (
    <>
      <div className="magic-line">
        <div className="magic-line__texture"></div>
      </div>
      <style jsx>
        {`
          .magic-line {
            position: relative;
            display: ${mobileDisplay};
            width: 100%;
            height: ${containerMobileHeight}px;
            z-index: 99;

            &__texture {
              position: absolute;
              top: 0;
              ${oppositePosition}: calc((100vw + 100%) / 2);
              width: calc(${width});
              height: calc(${height});
              min-width: ${minWidth};
              min-height: ${minHeight};
              max-width: ${magicLineTexture.maxWidth};
              max-height: ${magicLineTexture.maxHeight};

              &:after {
                content: '';
                top: calc(${mobileOverlappingDifference});
                ${oppositePosition}: -100%;
                position: absolute;
                width: 100%;
                height: 100%;
                background-image: url(${magicLineTexture.image});
                background-size: 100% 100%;
                transform: ${flip};
              }
            }
          }

          @media (${mq.desktop}) {
            .magic-line {
              display: block;
              height: ${containerHeight}px;

              &__texture {
                &:after {
                  top: calc(${overlappingDifference});
                }
              }
            }
          }
        `}
      </style>
    </>
  )
}
