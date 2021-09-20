import React from 'react'
import { RichText } from '../../elements/RichText'
import { Text } from '../../elements/Text'
import { VideoAutoplay } from '../../elements/VideoAutoplay'
import { mq } from '../../utils'
import { Hero } from '../Hero'
import { Image } from '../../elements/Image'
import { ValuePropsWithModalVideo } from '../ValuePropsWithModalVideo'
import { IHeroImage, IProps, IVideo } from './index'

export function HeroWithCTA({
  eyebrow,
  headline,
  subheading,
  renderCta1,
  renderCta2,
  footnote,
  layout,
  media,
  leftAlignMedia,
  valuePropsWithModalVideo,
}: IProps) {
  // Type Guards
  function isImage(data: IHeroImage | IVideo | undefined): data is IHeroImage {
    return !!(data as IHeroImage).imageRef
  }

  function isVideo(data: IHeroImage | IVideo | undefined): data is IVideo {
    return !!(data as IVideo).video
  }

  function renderMainContent() {
    return (
      <>
        {valuePropsWithModalVideo && <ValuePropsWithModalVideo {...valuePropsWithModalVideo} />}
        <div className="cta-wrapper">
          {/* CTA 1 */}
          <div className="cta primary">{renderCta1 && renderCta1()}</div>
          {/* CTA 2 */}
          {renderCta2 && <div className="cta secondary">{renderCta2 && renderCta2()}</div>}
          {/* Footnote */}
          {footnote && (
            <div className="footnote">
              <Text size="caption">
                <RichText html={footnote} />
              </Text>
            </div>
          )}
          <style jsx>
            {`
              .cta-wrapper {
                justify-self: stretch;
              }
              .cta {
                margin: 0 0 ${renderCta2 ? '16px' : '22px'} 0;
              }
              .secondary {
                margin: 0 0 22px;
              }
              .footnote {
                display: block;
              }
              img {
                max-width: 100%;
                margin-top: 48px;
              }
              @media (${mq.tablet}) {
                .cta-wrapper {
                  justify-self: unset;
                }
                .cta {
                  display: inline-block;
                }
                .primary {
                  margin: 0 ${renderCta2 ? '15px' : '0px'} 22px 0;
                }
              }
            `}
          </style>
        </div>
      </>
    )
  }

  function renderImage() {
    return (
      isImage(media) && (
        <>
          <Image
            classNames={'hero-cta-image'}
            altText={headline}
            borderRadius={30}
            {...media.imageRef}
          />
          <style jsx>
            {`
              img {
                max-width: 100%;
              }

              :global(.hero-cta-image) {
                border-radius: 25px;
              }
            `}
          </style>
        </>
      )
    )
  }

  function renderVideo() {
    return (
      isVideo(media) && (
        <VideoAutoplay
          video={media.video}
          videoWebm={media.videoWebm}
          fallbackImage={media.fallbackImage}
          playOnce={media.playOnce}
          alt={headline}
        />
      )
    )
  }

  const determineMediaIsImageOrVideo =
    media &&
    (isImage(media)
      ? { isBackground: media.isBackground, renderAuxContent: renderImage }
      : {
          isBackground: media.isBackground,
          renderAuxContent: renderVideo,
        })

  return (
    <Hero
      eyebrow={eyebrow}
      headline={headline}
      subheading={subheading}
      renderMainContent={renderMainContent}
      layout={layout}
      media={determineMediaIsImageOrVideo}
      leftAlignMedia={leftAlignMedia}
    />
  )
}
