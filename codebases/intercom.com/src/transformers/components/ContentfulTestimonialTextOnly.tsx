import React from 'react'
import { IProps as ITestimonialTextOnly } from 'marketing-site/src/library/components/TestimonialTextOnly'
import { ITestimonialTextOnly as IContentfulTestimonialTextOnly } from 'marketing-site/@types/generated/contentful'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import EntryMarker from 'marketing-site/src/components/common/EntryMarker'
import { TestimonialTextOnly } from 'marketing-site/src/library/components/TestimonialTextOnly'
import { transformImage } from '../elements/ContentfulImage'

export const ContentfulTestimonialTextOnly = (
  testimonialTextOnly: IContentfulTestimonialTextOnly,
) => (
  <EntryMarker entry={testimonialTextOnly}>
    {() => <TestimonialTextOnly {...transformTestimonialTextOnly(testimonialTextOnly)} />}
  </EntryMarker>
)

export function transformTestimonialTextOnly({ fields }: IContentfulTestimonialTextOnly) {
  const transformedData: Omit<ITestimonialTextOnly, 'isMobile'> = {
    ...fields,
    headline: fields.heading && fields.heading,
    quote: fields.message,
    hasQuotationMark: fields.hangingPunctuation && fields.hangingPunctuation,
    resultCopy: documentToHtmlString(fields.resultCopy),
    resultLink: fields.resultLink && documentToHtmlString(fields.resultLink),
    resultLogo: fields.testimonialTextOnlyLogo && fields.testimonialTextOnlyLogo.fields.file.url,
    avatar: fields.avatar && transformImage(fields.avatar),
  }
  return transformedData
}
