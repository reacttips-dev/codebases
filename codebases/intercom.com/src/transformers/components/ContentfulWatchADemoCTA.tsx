import { Entry } from 'contentful'
import { IWatchADemoCta as IContentfulWatchADemoCta } from 'marketing-site/@types/generated/contentful'
import EntryMarker from 'marketing-site/src/components/common/EntryMarker'
import { IProps, WatchADemoCTA } from 'marketing-site/src/library/components/WatchADemoCTA'
import * as Utils from 'marketing-site/src/library/utils'
import React from 'react'
import { transformMarketoFormV2 } from './ContentfulMarketoForm'

export const ContentfulWatchADemoCTA = (data: IContentfulWatchADemoCta) => (
  <EntryMarker entry={data}>
    <WatchADemoCTA {...transformWatchADemoCTA(data)} />
  </EntryMarker>
)

export function isWatchADemoCTA(entry: Entry<any>): entry is IContentfulWatchADemoCta {
  return entry.sys.contentType.sys.id === 'watchADemoCta'
}

export function transformWatchADemoCTA({ fields }: IContentfulWatchADemoCta): IProps {
  return {
    ...fields,
    bgColor: Utils.getHexColorFromName(fields.bgColor),
    ctaColorTheme: Utils.getTypedCtaTheme<Utils.CTATheme>(fields.ctaColorTheme),
    marketoForm: transformMarketoFormV2(fields.marketoForm.fields),
    image: fields.image && fields.image.fields.file.url,
  }
}
