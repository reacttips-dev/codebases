import {
  ICapabilitiesCarousel,
  ICapabilitiesCarouselParallax,
  ICapabilitiesCarouselSlide,
} from 'marketing-site/@types/generated/contentful'
import EntryMarker from 'marketing-site/src/components/common/EntryMarker'
import {
  CapabilitiesCarousel,
  IProps,
} from 'marketing-site/src/library/components/CapabilitiesCarousel'
import { IProps as ICapabilitiesCarouselSlideProps } from 'marketing-site/src/library/components/CapabilitiesCarouselSlide'
import React from 'react'

export const ContentfulCapabilitiesCarousel = (data: ICapabilitiesCarousel) => (
  <EntryMarker entry={data}>
    <CapabilitiesCarousel {...transformCapabilitiesCarousel(data)} />
  </EntryMarker>
)

export function transformCapabilitiesCarousel({
  fields,
}: ICapabilitiesCarousel | ICapabilitiesCarouselParallax): IProps {
  return {
    ...fields,
    slides: fields.slides.map(transformCapabilitiesCarouselSlide),
  }
}

function transformCapabilitiesCarouselSlide({
  fields,
}: ICapabilitiesCarouselSlide): ICapabilitiesCarouselSlideProps {
  return {
    ...fields,
    alt: fields.alt,
    video: fields.video.fields.file.url,
    videoWebm: fields.videoWebm && fields.videoWebm.fields.file.url,
    fallbackImage: fields.fallbackImage.fields.file.url,
  }
}
