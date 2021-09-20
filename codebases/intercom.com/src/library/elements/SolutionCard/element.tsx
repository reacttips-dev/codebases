import { Image } from 'marketing-site/src/library/elements/Image'
import React, { KeyboardEvent, MouseEvent, useRef } from 'react'
import { BUMP_UP, mq, getColorTheme } from '../../utils'
import { CTALink } from '../CTALink'
import { Text } from '../Text'
import { IProps } from './index'

export function SolutionCard(props: IProps) {
  const { cursiveTitle, title, body, cta, staticImage, animatedImage, cardColor } = props
  const themeColors = getColorTheme(cardColor)

  const ctaRef = useRef<HTMLAnchorElement>(null)

  const cardOnClick = (event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => {
    if (ctaRef.current !== null && event.target !== ctaRef.current) {
      ctaRef.current.click()
    }
  }

  return (
    <div
      className="card"
      data-testid="solution-card"
      key={title}
      onClick={cardOnClick}
      onKeyPress={cardOnClick}
      role="link"
      tabIndex={0}
    >
      <div className="image-wrapper">
        <div className="static">
          <Image {...staticImage} />
        </div>
        {animatedImage && (
          <div className="animated">
            <Image {...animatedImage} />
          </div>
        )}
      </div>
      <div className="body-wrapper">
        {cursiveTitle && <Text size="lg-eyebrow">{cursiveTitle}</Text>}
        <div className="card-title">
          <Text size="xl+">{title}</Text>
        </div>
        {body?.trim() && (
          <p className="card-body">
            <Text size="body">{body}</Text>
          </p>
        )}
        {cta && (
          <div className="cta">
            <CTALink {...cta} bgColor={themeColors.CTATheme} anchorRef={ctaRef} />
          </div>
        )}
      </div>
      <style jsx>
        {`
          .card {
            overflow: hidden;
            border-radius: 25px;
            transform: translate3d(0, 0, 0);
            display: flex;
            flex-direction: column;
            cursor: pointer;
          }

          .image-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;

            .animated,
            .static {
              border-radius: 25px 25px 0px 0px;
              overflow: hidden;
              max-width: 100%;
            }
          }

          .body-wrapper {
            padding: ${!cta ? '24px 36px' : '34px 36px'};
            color: ${themeColors.textColor};
            background-color: ${themeColors.backgroundColor};
            display: grid;
            flex: 1;
          }

          .card-title {
            margin: 0 0 16px;
          }

          .card-cursive-title {
            font-family: 'Smile Script', sans-serif;
            font-size: 23px;
            line-height: 1.2;
          }

          .cta {
            align-self: flex-end;
          }

          .card-body {
            margin-bottom: ${cta ? '48px' : '0'};
            line-height: 1.4;
          }

          @media (${mq.tablet}) {
            .card {
              margin-top: 10px; /*  provide space for bump-up */
              transition: ${BUMP_UP.TRANSITION};
            }

            .static {
              z-index: 5;
            }

            .animated {
              position: absolute;
              z-index: 4;
            }

            .card:hover {
              transform: ${BUMP_UP.TRANSFORM};

              .animated {
                position: absolute;
                z-index: 6;
              }
            }
          }

          @media (${mq.mobile}) {
            .static {
              z-index: 4;
            }

            .animated {
              position: absolute;
              z-index: 6;
            }
          }
        `}
      </style>
    </div>
  )
}
