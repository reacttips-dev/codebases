import classNames from 'classnames'
import { CTALink } from 'marketing-site/src/library/elements/CTALink'
import { Image } from 'marketing-site/src/library/elements/Image'
import { Text } from 'marketing-site/src/library/elements/Text'
import { CTATheme } from 'marketing-site/src/library/utils'
import React, { KeyboardEvent, MouseEvent, useRef } from 'react'
import { IProps } from './index'

export function Link({
  appearance,
  url,
  newWindow,
  id,
  thumbnail,
  label,
  title,
  description,
  ctaLabel,
}: IProps) {
  const ctaRef = useRef<HTMLAnchorElement>(null)

  const cardOnClick = (event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => {
    if (ctaRef.current !== null && event.target !== ctaRef.current) {
      ctaRef.current.click()
    }
  }

  const renderTitleText = (title: string) => {
    const titleText = <Text size="md+">{title}</Text>

    if (appearance === 'Small Cards') {
      return titleText
    }

    return (
      <>
        <div className="learn__link-title-ellipsis">{titleText}</div>
        <style jsx>
          {`
            .learn__link-title-ellipsis {
              position: absolute;
              width: 100%;
              height: 100%;
              top: 0;
              left: 0;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          `}
        </style>
      </>
    )
  }

  const renderImage = (url: string) => {
    if (appearance === 'Small Cards') {
      return (
        <>
          <div className="small-cards__image">
            <Image url={url} width={328} height={208} transform="fill" borderRadius={12} />
          </div>
          <style jsx>{`
            .small-cards__image {
              overflow: hidden;
              border-radius: 12px;
            }
          `}</style>
        </>
      )
    }
    const width = 758
    const height = 480
    return (
      <>
        <div className="relative-image">
          <div className="absolute-image">
            <Image url={url} width={width} height={height} transform="fill" borderRadius={25} />
          </div>
        </div>
        <style jsx>{`
          .relative-image {
            position: relative;
            width: 100%;
            height: 0;
            padding-top: ${calculateHeightProportion(width, height)}%;
            overflow: hidden;
            border-radius: 25px;
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

  const wrapperClassNames = classNames('learn__link-anchor-wrapper', {
    'learn__link-anchor-wrapper-embedded': appearance === 'Embedded',
    'learn__link-anchor-wrapper-small': appearance === 'Small Cards',
  })

  return (
    <>
      <div
        onClick={cardOnClick}
        onKeyPress={cardOnClick}
        className={wrapperClassNames}
        role="link"
        tabIndex={0}
      >
        <div className="learn__link-item" key={id}>
          <div className="learn__link-image">{renderImage(thumbnail)}</div>
          <div className="learn__link-body">
            <div className="learn__link-label">
              <Text size="caption">{label}</Text>
            </div>
            <div className="learn__link-title">{renderTitleText(title)}</div>
            <div className="learn__link-description">
              <Text size="caption">{description}</Text>
            </div>
            <CTALink
              bgColor={CTATheme.LinkOnlyBlack}
              text={ctaLabel}
              url={url}
              small={true}
              newWindow={!!newWindow}
              anchorRef={ctaRef}
            />
          </div>
        </div>
      </div>
      <style jsx>{`
        .learn__link-anchor-wrapper {
          color: inherit;
          text-decoration: none;
          cursor: pointer;
        }

        .learn__link-image {
          display: block;
          background-size: cover;
          background-position: top center;

          .learn__link-anchor-wrapper-small & {
            height: 0;
            padding-bottom: 245px;
          }
        }

        :global(.learn__link-image picture img) {
          max-height: 100%;
          width: 100%;
        }

        .learn__link-label {
          color: $gray;
          margin-top: 20px;
        }

        .learn__link-title {
          position: relative;
          margin-top: 10px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          -moz-box-orient: vertical;
          width: 100%;
          height: ${appearance === 'Small Cards' ? '42px' : '21px'};
        }

        .learn__link-description {
          margin: 10px 0 20px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          -moz-box-orient: vertical;
          height: 38px;
        }

        .learn__link-anchor-wrapper-embedded {
          .learn__link-item {
            padding: 20px;
          }

          .learn__link-image {
            margin: -20px -20px 0 -20px;
          }
        }

        .learn__link-anchor-wrapper-small {
          .learn__link-item {
            display: flex;
            justify-items: center;
            align-items: center;
          }

          .learn__link-image {
            width: 50%;
            min-width: 50%;
            flex-basis: 50%;
            padding-bottom: 30%;
          }

          .learn__link-label {
            margin-top: 0;
          }

          .learn__link-body {
            width: 50%;
            min-width: 50%;
            flex-basis: 50%;
            padding-left: 20px;
          }

          .learn__link-description,
          :global(.cta-link) {
            display: none;
          }
        }
      `}</style>
    </>
  )
}
