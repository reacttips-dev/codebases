import { useMediaQuery } from 'marketing-site/src/library/utils'
import React, { useEffect, useRef, useState } from 'react'
import { loadImage } from '../../utils/network'
import { ImagePlaceholder } from '../Image'
import { LottieVideo } from '../../elements/LottieVideo'
import { IProps } from './index'

export function VideoAutoplay({
  video,
  mobileVideo,
  videoWebm,
  mobileVideoWebm,
  fallbackImage,
  playOnce,
}: IProps) {
  const isSmall = useMediaQuery('(max-width: 768px)')
  const [hideVideo, setHideVideo] = useState(typeof fallbackImage !== 'string')
  const [isVisible, ref] = useIsElementVisible<HTMLVideoElement>()
  const fallbackImageSrc = typeof fallbackImage === 'string' ? fallbackImage : fallbackImage.url
  const lottieAnimation = video.match(/\.json$/) ? video : undefined

  useEffect(() => {
    loadImage(fallbackImageSrc).then(() => setHideVideo(false))
  }, [fallbackImageSrc])

  useEffect(() => {
    if (!ref.current) return

    if (isVisible) {
      ref.current.play()
    } else {
      ref.current.pause()
    }
  }, [isVisible, ref])

  const regularVideo = (
    <>
      <video
        className="video-player"
        preload="metadata"
        poster={fallbackImageSrc}
        autoPlay
        loop={!playOnce}
        muted
        playsInline
        key={isSmall && mobileVideo ? mobileVideo : video}
        onLoadedData={() => setHideVideo(false)}
        ref={ref}
      >
        {videoWebm && (
          <source
            type="video/webm"
            src={isSmall && mobileVideoWebm ? mobileVideoWebm : videoWebm}
          />
        )}
        <source src={isSmall && mobileVideo ? mobileVideo : video} />
      </video>
      <style jsx>{`
        video {
          display: block;
          max-width: 100%;
        }
      `}</style>
    </>
  )

  return (
    <div
      className={`video-player-wrapper ${hideVideo ? 'video-player-wrapper--video-hidden' : ''}`}
    >
      {!lottieAnimation && regularVideo}
      {lottieAnimation && (
        <LottieVideo animationUrl={lottieAnimation} placeHolder={fallbackImage} />
      )}
      {hideVideo && typeof fallbackImage !== 'string' && (
        <ImagePlaceholder width={fallbackImage.width!} height={fallbackImage.height!} />
      )}
      <style jsx>
        {`
          .video-player-wrapper {
            display: inline-block;
            position: relative;
            line-height: 0;
            border-radius: 25px;
            overflow: hidden;
          }

          .video-player-wrapper--video-hidden video {
            display: none;
          }
        `}
      </style>
    </div>
  )
}

function useIsElementVisible<T extends Element>(): [boolean, React.MutableRefObject<T | null>] {
  const ref = useRef<T | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    if (typeof window.IntersectionObserver === 'undefined') return
    const target = ref.current

    const visibilityChanged: IntersectionObserverCallback = function (entries) {
      entries.forEach((entry) => {
        setIsVisible(entry.isIntersecting)
      })
    }

    const observer = new IntersectionObserver(visibilityChanged)
    observer.observe(target)
    return () => observer.unobserve(target)
  })

  return [isVisible, ref]
}
