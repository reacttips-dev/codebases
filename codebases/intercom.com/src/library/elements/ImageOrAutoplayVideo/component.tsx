import React from 'react'
import { VideoAutoplay } from '../VideoAutoplay'
import { IProps } from './index'
import { Image, ImagePlaceholder } from '../Image'
import LazyLoad from 'react-lazyload'

export function ImageOrAutoplayVideo({
  imageRef,
  video,
  videoWebm,
  playOnce,
  mobileImage,
}: IProps) {
  const placeholder =
    imageRef.width &&
    imageRef.height &&
    (video ? (
      <div style={{ lineHeight: '0' }}>
        <ImagePlaceholder
          width={imageRef.width}
          height={imageRef.height}
          mobileWidth={mobileImage?.width}
          mobileHeight={mobileImage?.height}
        />
      </div>
    ) : (
      <ImagePlaceholder
        width={imageRef.width}
        height={imageRef.height}
        mobileWidth={mobileImage?.width}
        mobileHeight={mobileImage?.height}
      />
    ))

  return (
    <LazyLoad offset={300} placeholder={placeholder} once>
      {video ? (
        <VideoAutoplay
          video={video}
          videoWebm={videoWebm}
          fallbackImage={imageRef}
          playOnce={playOnce}
        />
      ) : (
        <Image mobileImage={mobileImage} {...imageRef} />
      )}
    </LazyLoad>
  )
}
