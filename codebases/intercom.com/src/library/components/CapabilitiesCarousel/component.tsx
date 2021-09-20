import classnames from 'classnames'
import {
  Color,
  fontGraphik,
  googleTagManagerCustomEvents,
  mq,
  triggerGoogleTagManagerCustomEvent,
  useIsElementVisible,
} from 'marketing-site/src/library/utils'
import React, { useEffect, useRef, useState } from 'react'
import Slider from 'react-slick'
import { CapabilitiesCarouselSlide } from '../CapabilitiesCarouselSlide/component'
import { CapabilityLabel } from 'marketing-site/src/library/components/CapabilityLabel'
import { IProps } from './index'

const capabilities = [
  { duration: 9000, label: 'live chat' },
  { duration: 7500, label: 'bots' },
  { duration: 9000, label: 'apps' },
  { duration: 9000, label: 'product tours' },
  { duration: 9000, label: 'more' },
]

function sanitizeString(string: string) {
  return string.replace(/\s+/g, '-').toLowerCase()
}

export function CapabilitiesCarousel({ slides }: IProps) {
  const [mounted, setMounted] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [autoplayInitialized, setAutoplayInitialized] = useState(false)
  const [sliderAutoplayCancelled, setSliderAutoplayCancelled] = useState(false)
  const sliderAutoplayCancelledRef = useRef(sliderAutoplayCancelled)
  sliderAutoplayCancelledRef.current = sliderAutoplayCancelled
  const slider = useRef<Slider>(null)
  const [isVisible, ref] = useIsElementVisible<HTMLDivElement>(0.1)

  useEffect(() => {
    // Slick can't calculate correctly size if we init it before page load
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!slider.current) return
    if (!isVisible) return
    if (autoplayInitialized) return
    setAutoplayInitialized(true)
    slider.current.slickGoTo(0)

    function triggerSliderResizeAndSetVideoLoaded() {
      ;(slider.current as any)?.innerSlider.onWindowResized()
      setVideoLoaded(true)
    }
    const firstSlideVideo = ref.current?.querySelector<HTMLVideoElement>(
      '.slick-slide[data-index="0"] video',
    )
    if (firstSlideVideo) {
      if (firstSlideVideo.readyState > 0) {
        triggerSliderResizeAndSetVideoLoaded()
      } else {
        firstSlideVideo.addEventListener('loadedmetadata', () => {
          triggerSliderResizeAndSetVideoLoaded()
        })
      }
    }

    ref.current
      ?.querySelectorAll<HTMLVideoElement>('.slick-slide video')
      .forEach((video, index) => {
        video.addEventListener('ended', () => {
          if (sliderAutoplayCancelledRef.current) {
            video.play()
          } else {
            slider.current?.slickGoTo((index + 1) % capabilities.length)
          }
        })
      })
  }, [ref, slider, isVisible, autoplayInitialized])

  const settings = {
    arrows: false,
    dots: false,
    speed: 0,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (currentSlide: number, nextSlide: number) => {
      setCurrentSlide(nextSlide)
    },
    vertical: true,
    infinite: false,
  }

  function clickCapability(index: number) {
    setSliderAutoplayCancelled(true)
    slider.current?.slickGoTo(index)
    triggerGoogleTagManagerCustomEvent(googleTagManagerCustomEvents.capabilitiesCarouselClicked, {
      index,
      // eslint-disable-next-line @typescript-eslint/camelcase
      capability_name: capabilities[index].label,
    })
  }

  function renderCapabilityLabel(index: number) {
    return (
      <CapabilityLabel
        active={currentSlide === index}
        body={capabilities[index].label}
        onClick={() => clickCapability(index)}
      />
    )
  }
  return (
    <div ref={ref} className="capabilities-carousel">
      <div className="capabilities-carousel-contents">
        <h2 className="capabilities-descriptions">
          Sure, it does {renderCapabilityLabel(0)}. But there’s also {renderCapabilityLabel(1)},{' '}
          {renderCapabilityLabel(2)}, {renderCapabilityLabel(3)}, and {renderCapabilityLabel(4)}
          —like email, messages, and a help center—that help you build relationships with your
          customers.
        </h2>

        <div className="carousel-container">
          <div
            className={classnames('progress-bar', { active: !sliderAutoplayCancelled })}
            data-testid="progress-bar"
          >
            {capabilities.map((capability, index) => (
              <div
                key={sanitizeString(capability.label)}
                className={classnames('progress-bar-fill', {
                  active: autoplayInitialized && currentSlide === index,
                })}
                data-testid="progress-bar-fill"
                style={{ transition: `width ${capability.duration}ms linear` }}
              />
            ))}
          </div>
          {mounted && (
            <Slider ref={slider} {...settings}>
              {slides.map((slide) => (
                <div
                  key={sanitizeString(slide.alt)}
                  className={classnames('video-container', { loaded: videoLoaded })}
                >
                  <CapabilitiesCarouselSlide {...slide} />
                </div>
              ))}
            </Slider>
          )}
        </div>
      </div>
      <style jsx>
        {`
          .capabilities-carousel {
            margin: 60px auto;
            display: grid;
            grid-template-columns: [left-gutter] 1fr [contents] 12fr [right-gutter] 1fr;
          }

          .capabilities-carousel-contents {
            margin: auto;
            grid-column: contents;
          }

          .capabilities-descriptions {
            font-size: 24px;
            font-weight: 600;
            font-family: ${fontGraphik};
            margin-bottom: 1.2em;
            line-height: 140%;
          }

          .carousel-container {
            position: relative;
            background-color: white;
            border-radius: 8px;
            overflow: hidden;
          }

          .video-container {
            opacity: 0;
            &.loaded {
              opacity: 1;
            }
          }

          .progress-bar {
            position: absolute;
            height: 3px;
            opacity: 0;
            top: 1px;
            width: 88%;
            left: 1rem;
            overflow: hidden;
            border-top-left-radius: 25px;
            border-top-right-radius: 25px;

            &.active {
              opacity: 1;
            }

            .progress-bar-fill {
              position: absolute;
              width: 0;
              height: 100%;
              background-color: ${Color.Blue};
              z-index: -1;

              &.active {
                width: 100%;
                z-index: 2;
              }
            }
          }

          @media (${mq.tablet}) {
            .capabilities-carousel-contents {
              max-width: $container-max-width;
              display: grid;
              grid-template-columns: [descriptions] 1fr [carousel] 1fr;
              grid-column-gap: 30px;
            }
            .capabilities-descriptions {
              grid-column: descriptions;
              font-size: 32px;
              line-height: 120%;
              letter-spacing: -1.09px;
              margin-bottom: 0;
            }
            .carousel-container {
              grid-column: carousel;
              border-radius: 10px;
            }
            .progress-bar {
              height: 3.5px;
            }
          }

          @media (min-width: 900px) {
            .capabilities-descriptions {
              font-size: 36px;
            }
          }

          @media (${mq.laptop}) {
            .capabilities-descriptions {
              font-size: 38px;
            }
            .carousel-container {
              border-radius: 12.5px;
            }
            .progress-bar {
              height: 4.5px;
              width: 92%;
            }
          }

          @media (${mq.desktop}) {
            .capabilities-descriptions {
              font-size: 44px;
            }
          }

          @media (min-width: 1200px) {
            .capabilities-descriptions {
              font-size: 50px;
            }
          }

          @media (${mq.desktopLg}) {
            .capabilities-carousel-contents {
              grid-column-gap: 60px;
            }
            .capabilities-descriptions {
              font-size: 58px;
            }
            .carousel-container {
              border-radius: 16.5px;
            }
            .progress-bar {
              top: 2px;
              width: 95%;
              left: 0.8rem;
            }
          }

          :global(.slick-active) .carousel-slide {
            cursor: default;
          }
        `}
      </style>
    </div>
  )
}
