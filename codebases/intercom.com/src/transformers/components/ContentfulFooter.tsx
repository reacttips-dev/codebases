import React from 'react'
import { IProps as IFooter, Footer } from 'marketing-site/src/library/components/Footer'
import { IntercomLocalePicker } from 'marketing-site/src/components/common/LocalePicker'

import {
  IFooter2 as IContentfulFooter,
  IFooterLinks as IContentfulFooterLink,
  IFooterSectionElement as IContentfulFooterSectionElement,
  ILocalePicker,
} from 'marketing-site/@types/generated/contentful'

import { transformFooterLink } from 'marketing-site/src/transformers/elements/ContentfulFooterLink'
import { transformFooterSection } from 'marketing-site/src/transformers/elements/ContentfulFooterSectionElement'
import EntryMarker from 'marketing-site/src/components/common/EntryMarker'

export const ContentfulFooter = (footer: IContentfulFooter) => (
  <EntryMarker entry={footer}>{() => <Footer {...transformFooter(footer)} />}</EntryMarker>
)

function renderLocalePicker(fields: ILocalePicker) {
  return <IntercomLocalePicker {...fields} />
}

export function transformFooter({ fields }: IContentfulFooter): IFooter {
  return {
    ...fields,
    primaryLinks: fields.primaryLinks.map(determineLinkOrSection),
    secondaryLinks: fields.secondaryLinks.map(transformFooterLink),
    renderExtraContent: () => renderLocalePicker(fields.localePicker),
  }
}

// -- Type Guard --

const isFooterLinkEntry = (
  entry: IContentfulFooterLink | IContentfulFooterSectionElement,
): entry is IContentfulFooterLink => entry && !!(entry as IContentfulFooterLink).fields.url

function determineLinkOrSection(item: IContentfulFooterLink | IContentfulFooterSectionElement) {
  return isFooterLinkEntry(item) ? transformFooterLink(item) : transformFooterSection(item)
}
