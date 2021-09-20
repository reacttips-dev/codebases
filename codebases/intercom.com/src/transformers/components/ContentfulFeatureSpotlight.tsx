import React from 'react'
import {
  IProps as IFeatureSpotlight,
  FeatureSpotlight,
} from 'marketing-site/src/library/components/FeatureSpotlight'
import { IFeatureSpotlight as IContentfulFeatureSpotlight } from 'marketing-site/@types/generated/contentful'
import { transformFeatureSpotlightBase } from 'marketing-site/src/transformers/components/ContentfulFeatureSpotlightBase'
import { transformImage } from 'marketing-site/src/transformers/elements/ContentfulImage'
import EntryMarker from 'marketing-site/src/components/common/EntryMarker'
import { IContentfulFeatureSpotlights } from 'marketing-site/src/transformers/components/ContentfulFeatureSpotlightBase'

export const ContentfulFeatureSpotlight = (featureSpotlight: IContentfulFeatureSpotlight) => {
  return (
    <EntryMarker entry={featureSpotlight}>
      {() => <FeatureSpotlight {...transformFeatureSpotlight(featureSpotlight)} />}
    </EntryMarker>
  )
}

export function transformFeatureSpotlight({
  fields,
}: IContentfulFeatureSpotlights): IFeatureSpotlight {
  return {
    ...transformFeatureSpotlightBase(fields),
    productImgRef: transformImage(fields.productImgRef),
    productVideo: fields.video && fields.video.fields.file.url,
    productVideoWebm: fields.videoWebm && fields.videoWebm.fields.file.url,
  }
}
