import {
  ILogoParty as IContentfulLogoParty,
  ILogoPartyHeading as IContentfulLogoPartyHeading,
  ILogoPartyHeadingSet as IContentfulLogoPartyHeadingSet,
} from 'marketing-site/@types/generated/contentful'
import EntryMarker from 'marketing-site/src/components/common/EntryMarker'
import {
  Headings,
  IProps as ILogoParty,
  ISingleHeading,
  LogoParty,
} from 'marketing-site/src/library/components/LogoParty'
import { getTypedHeadingStyle, getHexColorFromName } from 'marketing-site/src/library/utils'
import { getTextAlignByKey, TextAlign } from 'marketing-site/src/library/utils/constants/textAlign'
import { transformCTALink } from 'marketing-site/src/transformers/elements/ContentfulCTALink'
import { transformLogo } from 'marketing-site/src/transformers/elements/ContentfulLogo'
import React from 'react'

export const ContentfulLogoParty = (logoParty: IContentfulLogoParty) => (
  <EntryMarker entry={logoParty}>
    {() => <LogoParty {...transformLogoParty(logoParty)} />}
  </EntryMarker>
)

type ContentfulLogoPartyHeadingItem = IContentfulLogoPartyHeading | IContentfulLogoPartyHeadingSet

const isSingleHeading = (
  entry: ContentfulLogoPartyHeadingItem,
): entry is IContentfulLogoPartyHeading => entry.sys.contentType.sys.id === 'logoPartyHeading'

export function transformLogoParty({ fields }: IContentfulLogoParty): ILogoParty {
  return {
    ...fields,
    headings: transformLogoPartyHeadingItem(fields.headings),
    bgColor: getHexColorFromName(fields.bgColor),
    cta: fields.cta ? transformCTALink(fields.cta) : undefined,
    logos: fields.logos.map(transformLogo),
    textAlign: fields.textAlign ? getTextAlignByKey(fields.textAlign) : TextAlign.Center,
  }
}

function transformLogoPartyHeading({ fields }: IContentfulLogoPartyHeading): ISingleHeading {
  return {
    ...fields,
    style: getTypedHeadingStyle(fields.style),
  }
}

function transformLogoPartyHeadingSet({ fields }: IContentfulLogoPartyHeadingSet): Headings {
  return {
    ...fields,
  }
}

const transformLogoPartyHeadingItem = (item: ContentfulLogoPartyHeadingItem) =>
  isSingleHeading(item) ? transformLogoPartyHeading(item) : transformLogoPartyHeadingSet(item)
