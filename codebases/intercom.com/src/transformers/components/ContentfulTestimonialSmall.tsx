import React from 'react'
import { IProps as ITestimonialSmall } from 'marketing-site/src/library/components/TestimonialSmall'
import { ITestimonialSmall as IContentfulTestimonialSmall } from 'marketing-site/@types/generated/contentful'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import EntryMarker from 'marketing-site/src/components/common/EntryMarker'
import { TestimonialSmall } from 'marketing-site/src/library/components/TestimonialSmall'
import { transformImage } from '../elements/ContentfulImage'

export const ContentfulTestimonialSmall = (testimonialSmall: IContentfulTestimonialSmall) => (
  <EntryMarker entry={testimonialSmall}>
    {() => <TestimonialSmall {...transformTestimonialSmall(testimonialSmall)} />}
  </EntryMarker>
)

export function transformTestimonialSmall({ fields }: IContentfulTestimonialSmall) {
  const transformedData: ITestimonialSmall = {
    ...fields,
    nameCopy: documentToHtmlString(fields.nameCopy),
    avatar: fields.avatar && transformImage(fields.avatar),
  }
  return transformedData
}
