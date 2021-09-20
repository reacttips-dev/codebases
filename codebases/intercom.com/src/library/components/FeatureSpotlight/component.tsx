import React from 'react'
import { ImageOrAutoplayVideo } from '../../elements/ImageOrAutoplayVideo'
import { FeatureSpotlightBase } from '../FeatureSpotlightBase'
import { IProps } from './index'
import { IProps as IImage } from 'marketing-site/src/library/elements/Image'

const borderRadius = 25

export const FeatureSpotlight = (props: IProps) => {
  const renderMedia = () => {
    const { productImgRef, productVideo, productVideoWebm } = props
    const newImageRef: IImage = {
      ...productImgRef,
      borderRadius,
    }
    return (
      <>
        <div className="feature-spotlight__image-wrapper">
          <ImageOrAutoplayVideo
            imageRef={newImageRef}
            video={productVideo}
            videoWebm={productVideoWebm}
          />
        </div>
        <style jsx>{`
          .feature-spotlight__image-wrapper {
            border-radius: ${borderRadius}px;
            overflow: hidden;
          }
        `}</style>
      </>
    )
  }

  return <FeatureSpotlightBase {...props} isZippered renderMedia={renderMedia} />
}
