import { Entry } from 'contentful'
import { ICtaLink as IContentfulCTALink } from 'marketing-site/@types/generated/contentful'
import EntryMarker from 'marketing-site/src/components/common/EntryMarker'
import {
  CTALink,
  ICTAData,
  IProps as ICtaLinkProps,
} from 'marketing-site/src/library/elements/CTALink'
import * as Utils from 'marketing-site/src/library/utils'
import React from 'react'

export const ContentfulCTALink = (ctaLink: IContentfulCTALink) => (
  <EntryMarker entry={ctaLink}>
    <CTALink {...transformCTAWithBackground(ctaLink)} />
  </EntryMarker>
)

export function isCTALink(entry: Entry<any>): entry is IContentfulCTALink {
  return entry.sys.contentType.sys.id === 'ctaLink'
}

export function transformCTALink({ fields }: IContentfulCTALink): ICTAData {
  return {
    ...fields,
    text: fields.label,
    newWindow: fields.openInNewWindow,
  }
}

export function passEventContextToCtaLink(
  eventContext: string | undefined,
  cta: IContentfulCTALink,
) {
  if (eventContext) {
    cta.fields.eventContext = eventContext
  }
}

export function transformCTAWithBackground({ fields }: IContentfulCTALink): ICtaLinkProps {
  const { label, color, openInNewWindow, arrow } = fields
  return {
    ...fields,
    text: label,
    bgColor: (color && Utils.getTypedCtaTheme<Utils.CTATheme>(color)) || Utils.CTATheme.BlackFill,
    newWindow: openInNewWindow,
    arrow: arrow !== false,
  }
}
