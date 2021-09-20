import { Asset } from 'contentful'
import { Document } from '@contentful/rich-text-types'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import {
  ICtaLink,
  IJumpLink as IContentfulJumpLink,
  IFeatureSpotlight as IContentfulFeatureSpotlight,
  IFeatureSpotlightCitation as IContentfulFeatureSpotlightCitation,
  IFeatureSpotlightWithTestimonial as IContentfulFeatureSpotlightTestimonial,
  IFeatureSpotlightWithProductDemo as IContentfulFeatureSpotlightWithProductDemo,
} from 'marketing-site/@types/generated/contentful'
import { transformCTAWithBackground } from 'marketing-site/src/transformers/elements/ContentfulCTALink'
import * as Utils from 'marketing-site/src/library/utils'
import { transformJumpLink } from 'marketing-site/src/transformers/elements/ContentfulJumpLink'

export type IContentfulFeatureSpotlights =
  | IContentfulFeatureSpotlight
  | IContentfulFeatureSpotlightCitation
  | IContentfulFeatureSpotlightTestimonial
  | IContentfulFeatureSpotlightWithProductDemo

export interface IContentfulFeatureSpotlightBase {
  heading: string
  subheadingRichText?: Document
  bgColor?: string
  imageSide: boolean
  cta?: ICtaLink
  icon?: Asset
  iconText?: string
  topTexture?: boolean
  jumpLink?: IContentfulJumpLink
}

export function transformFeatureSpotlightBase(
  featureSpotlightBase: IContentfulFeatureSpotlightBase,
) {
  return {
    ...featureSpotlightBase,
    subheading:
      featureSpotlightBase.subheadingRichText &&
      documentToHtmlString(featureSpotlightBase.subheadingRichText),
    bgColor: featureSpotlightBase.bgColor
      ? Utils.getHexColorFromName(featureSpotlightBase.bgColor)
      : undefined,
    isFlipped: featureSpotlightBase.imageSide,
    cta: (featureSpotlightBase.cta && transformCTAWithBackground(featureSpotlightBase.cta)) || null,
    icon: (featureSpotlightBase.icon && featureSpotlightBase.icon.fields.file.url) || null,
    hasTopTexture: featureSpotlightBase.topTexture,
    jumpLink:
      (featureSpotlightBase.jumpLink && transformJumpLink(featureSpotlightBase.jumpLink)) || null,
  }
}
