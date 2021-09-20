import React from 'react'
import { IProps as IIDLink, IDLink } from 'marketing-site/src/library/components/IDLink'
import { IIdLink as IContentfulIDLink } from 'marketing-site/@types/generated/contentful'
import EntryMarker from 'marketing-site/src/components/common/EntryMarker'

export const ContentfulIDLink = (data: IContentfulIDLink) => {
  return (
    <EntryMarker entry={data}>
      <IDLink {...transformIDLink(data)} />
    </EntryMarker>
  )
}

export function transformIDLink(data: IContentfulIDLink): IIDLink {
  return {
    ...data.fields,
  }
}
