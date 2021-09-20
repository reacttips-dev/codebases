import React, { useEffect, useLayoutEffect, useState, useRef } from 'react'
import { IProps, ILottieAnimationData } from './index'
import Lottie, { LottieRefCurrentProps } from 'lottie-react'
import LazyLoad from 'react-lazyload'
import { captureException } from 'marketing-site/lib/sentry'
import { Image, IProps as IImage } from 'marketing-site/src/library/elements/Image'
import cn from 'classnames'

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export const LottieVideo: React.FC<IProps> = (props) => {
  const {
    animationUrl,
    width = 2000,
    height,
    placeHolder,
    autoplay,
    forcedAnimationState,
    forcePoster = false,
  } = props
  const [animation, setAnimation] = useState<ILottieAnimationData | null>(null)
  const [loaded, setLoaded] = useState(false)
  const lottieRef = useRef<LottieRefCurrentProps>(null)

  useIsomorphicLayoutEffect(() => {
    fetch(`https:${animationUrl}`)
      .then((res) =>
        res.json().then((jsonRes) => {
          setAnimation(jsonRes)
        }),
      )
      .catch(captureException)
  }, [])

  let imageProps: IImage = {
    url: '',
    width: width,
    height: height,
    transform: 'thumb',
  }

  if (typeof placeHolder === 'string') {
    imageProps.url = placeHolder
  } else {
    imageProps = { ...imageProps, ...placeHolder }
  }

  const PlaceHolder = <Image {...imageProps} />

  const play = () => {
    if (!lottieRef.current) return
    lottieRef.current.play()
  }

  const pause = () => {
    if (!lottieRef.current) return
    lottieRef.current.pause()
  }

  const stop = () => {
    if (!lottieRef.current) return
    lottieRef.current.stop()
  }

  if (forcedAnimationState === 'pause') {
    pause()
  }
  if (forcedAnimationState === 'stop') {
    stop()
  }
  if (forcedAnimationState === 'play') {
    play()
  }

  const showPoster = !animation || !loaded || forcedAnimationState === 'stop' || forcePoster

  const posterClasses = cn('lottie-video__poster', {
    'lottie-video__poster--hide': !showPoster,
  })

  const animationClasses = cn('lottie-video__animation', {
    'lottie-video__animation--loaded': loaded,
  })

  return (
    <>
      <div className="lottie-video__wrapper">
        {animation && (
          <LazyLoad offset={300} once>
            <div className={animationClasses}>
              <Lottie
                lottieRef={lottieRef}
                onDOMLoaded={() => {
                  setLoaded(true)
                }}
                animationData={animation}
                autoplay={autoplay}
              />
            </div>
          </LazyLoad>
        )}

        <div className={posterClasses}>{PlaceHolder}</div>
      </div>

      <style jsx>{`
        .lottie-video__wrapper {
          display: grid;
          grid-template-columns: 1fr;
        }

        .lottie-video__wrapper > * {
          grid-row-start: 1;
          grid-column-start: 1;
        }

        .lottie-video {
          &__animation {
            position: absolute;
            max-width: 1px;
            max-height: 1px;
            visibility: hidden;
            &--loaded {
              position: unset;
              max-width: unset;
              max-height: unset;
              visibility: unset;
            }
          }
        }

        .lottie-video__poster {
          opacity: 1;
          position: relative;
          transition: opacity 0.25s;
          &--hide {
            opacity: 0;
          }
        }

        :global(.lottie-video__animation svg) {
          width: ${width}px !important;
          height: auto !important;
          max-height: 100%;
          max-width: 100%;
        }
      `}</style>
    </>
  )
}
