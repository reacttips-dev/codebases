import React from 'react'
import {
  IProps as IEnterpriseSolutionBanner,
  EnterpriseSolutionBanner,
} from 'marketing-site/src/library/components/EnterpriseSolutionBanner'

import { IEnterpriseSolutionBanner as IContentfulEnterpriseSolutionBanner } from 'marketing-site/@types/generated/contentful'
import EntryMarker from 'marketing-site/src/components/common/EntryMarker'
import { transformImage } from '../elements/ContentfulImage'
import { transformCTAWithBackground } from 'marketing-site/src/transformers/elements/ContentfulCTALink'
import { getHexColorFromName } from 'marketing-site/src/library/utils'

export const ContentfulEnterpriseSolutionBanner = (
  enterpriseSolutionBanner: IContentfulEnterpriseSolutionBanner,
) => (
  <EntryMarker entry={enterpriseSolutionBanner}>
    {() => (
      <EnterpriseSolutionBanner {...transformEnterpriseSolutionBanner(enterpriseSolutionBanner)} />
    )}
  </EntryMarker>
)

export function transformEnterpriseSolutionBanner({
  fields,
}: IContentfulEnterpriseSolutionBanner): IEnterpriseSolutionBanner {
  return {
    ...fields,
    icon: fields.icon && fields.icon.fields.file.url,
    cta: fields.cta && transformCTAWithBackground(fields.cta),
    imageRef: fields.imageRef && transformImage(fields.imageRef),
    bgColor: fields.bgColor && getHexColorFromName(fields.bgColor),
  }
}
