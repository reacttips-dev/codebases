import { IGatedContent as IContentfulGatedContent } from 'marketing-site/@types/generated/contentful'
import EntryMarker from 'marketing-site/src/components/common/EntryMarker'
import {
  GatedContent,
  IProps as IGatedContent,
} from 'marketing-site/src/library/components/GatedContent'
import * as Utils from 'marketing-site/src/library/utils'
import { CTA } from 'marketing-site/src/transformers/CTA'
import { transformImage } from 'marketing-site/src/transformers/elements/ContentfulImage'
import React from 'react'
import { transformLogoParty } from './ContentfulLogoParty'

export const ContentfulGatedContent = (gatedContent: IContentfulGatedContent) => (
  <EntryMarker entry={gatedContent}>
    {() => <GatedContent {...transformGatedContent(gatedContent)} />}
  </EntryMarker>
)

export function transformGatedContent({ fields }: IContentfulGatedContent): IGatedContent {
  return {
    ...fields,
    image: fields.image && transformImage(fields.image),
    enableBorders: fields.enableBorders || false,
    bgColor: Utils.getHexColorFromName(fields.bgColor),
    renderEmailForm: () => (
      <EntryMarker entry={fields.signUpCta}>{() => <CTA {...fields.signUpCta} />}</EntryMarker>
    ),
    logoParty: fields.logoParty && transformLogoParty(fields.logoParty),
    icon: fields.icon && fields.icon.fields.file.url,
  }
}
