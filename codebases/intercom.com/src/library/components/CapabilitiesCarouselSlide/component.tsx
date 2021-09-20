import { VideoAutoplay } from 'marketing-site/src/library/elements/VideoAutoplay'
import React from 'react'
import { IProps } from './index'

export function CapabilitiesCarouselSlide({
  video,
  alt,
  videoWebm,
  fallbackImage,
  playOnce,
}: IProps) {
  return (
    <VideoAutoplay
      video={video}
      videoWebm={videoWebm}
      fallbackImage={fallbackImage}
      playOnce={playOnce ?? true}
      alt={alt}
    />
  )
}
