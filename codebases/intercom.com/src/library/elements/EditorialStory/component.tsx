import classnames from 'classnames'
import React, { KeyboardEvent, MouseEvent, useRef } from 'react'
import { fontGraphik, mq } from '../../utils'
import { CTATheme } from '../../utils/constants/themes'
import { CTALink } from '../CTALink'
import { Image } from '../Image'
import { RichText } from '../RichText'
import { TagGroup } from '../TagGroup'
import { Text } from '../Text'
import { IProps } from './index'

export const EditorialStory = ({
  big,
  title,
  body,
  cta,
  imageRef,
  tags,
  eyebrow,
  asBiggerCard,
}: IProps) => {
  const ctaRef = useRef<HTMLAnchorElement>(null)

  const cardOnClick = (event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => {
    if (ctaRef.current !== null && event.target !== ctaRef.current) {
      ctaRef.current.click()
    }
  }

  const wrapperClasses = classnames({
    big: !!big,
    'editorial-story': true,
    small: !big,
    'editorial-story--bigger': asBiggerCard,
  })

  const renderImage = () => {
    const [width, height] = [658, 371]
    return (
      <>
        <div className="relative-container">
          <div className="absolute-image">
            <Image
              {...imageRef}
              width={width}
              height={height}
              transform={'fill'}
              borderRadius={25}
            />
          </div>
        </div>
        <style jsx>{`
          .relative-container {
            position: relative;
            width: 100%;
            height: 0;
            overflow: hidden;
            border-radius: 25px;
            padding-top: ${calculateHeightProportion(width, height)}%;
          }
          .absolute-image {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
          }
        `}</style>
      </>
    )
  }

  const calculateHeightProportion = (width: number, height: number) => (height * 100) / width

  return (
    <div
      onClick={cardOnClick}
      onKeyPress={cardOnClick}
      className="editorial-story__anchor-wrapper"
      role="link"
      tabIndex={-1}
    >
      <div className={wrapperClasses}>
        {/* Image */}
        <div className="image-cell">{renderImage()}</div>

        {/* Tags */}
        <div className="content-cell">
          {eyebrow && (
            <div className="eyebrow">
              <Text size="lg-eyebrow">{eyebrow}</Text>
            </div>
          )}
          {!!tags && !!tags.length && (
            <div className="tags">
              <TagGroup tagData={tags} />
            </div>
          )}

          {/* Title */}
          <div className="title">
            <RichText html={title} />
          </div>

          {/* Body */}
          {body && (
            <div className="body">
              <Text size="body">{body}</Text>
            </div>
          )}

          {/* CTA */}
          {cta && (
            <div className="cta">
              <CTALink
                {...cta}
                bgColor={big ? CTATheme.BlackFill : CTATheme.LinkOnlyBlack}
                anchorRef={ctaRef}
              />
            </div>
          )}
        </div>
      </div>
      <style jsx>
        {`
          .editorial-story__anchor-wrapper {
            text-decoration: inherit;
            color: inherit;
            cursor: pointer;
          }

          .editorial-story {
            display: grid;
            grid-template-rows: [image-row] min-content [content-row] 1fr;
            grid-row-gap: 30px;
            grid-template-columns: [content] 12fr;
            max-width: 400px;
          }

          .editorial-story--bigger {
            max-width: 100%;
          }

          .image-cell {
            grid-column: content;
            grid-row: image-row;
          }

          .content-cell {
            grid-row: content-row;
            display: block;
          }

          .eyebrow {
            color: $black;
            margin-bottom: 10px;
          }

          .title {
            /* custom fixed-size type treatment */
            font-size: ${big ? '26px' : '15px'};
            font-family: ${fontGraphik};
            line-height: ${big ? '1.2' : '1.4'};
            word-break: break-word;
            margin-bottom: 16px;
            margin-right: 10%;

            :global(.rich-text p) {
              line-height: 1.2;
            }
          }

          .big {
            .title {
              :global(.rich-text p) {
                line-height: 1.4;
              }
            }
          }

          :global(.big.editorial-story--bigger p) {
            line-height: 1.32;
          }

          .tags {
            margin-bottom: 16px;
          }

          .body {
            margin-right: 10%;
            margin-bottom: ${cta ? '16px' : '0'};
          }

          .cta {
            display: inline-block;
          }

          .big .cta {
            display: block;
          }

          @media (${mq.tablet}) {
            .cta {
              display: inline-block;
            }

            .editorial-story {
              grid-template-columns: [content] 10fr;
              max-width: 768px;
            }

            .editorial-story--bigger {
              max-width: 100%;
            }

            .big .title {
              margin-bottom: ${body ? '20px' : '24px'};
            }

            .big .body {
              margin-bottom: 30px;
            }

            .small {
              grid-template-columns: [content-col] 5fr 1fr [image-col] 4fr;
              grid-template-rows: [content] 1fr;
              align-items: center;
            }
            .small .image-cell {
              grid-column: image-col;
              grid-row: content;
            }
            .small .content-cell {
              grid-column: content-col;
              grid-row: content;
            }
          }

          @media (${mq.desktop}) {
            .big {
              grid-template-columns: [content] 5fr;
            }

            .small {
              grid-template-columns: [content-col] 4fr [image-col] 2fr;
              grid-template-rows: [content] 1fr;
              align-items: center;
            }
          }

          @media (${mq.desktopLg}) {
            .big {
              grid-template-columns: [content] 6fr;
            }

            .small {
              grid-template-columns: [content-col] 3fr [image-col] 2fr;
              grid-template-rows: [content] 1fr;
              align-items: center;
            }
          }
        `}
      </style>
    </div>
  )
}
