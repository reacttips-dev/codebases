import { IComponentGroup } from 'marketing-site/@types/generated/contentful'
import EntryMarker from 'marketing-site/src/components/common/EntryMarker'
import { ComponentGroup } from 'marketing-site/src/library/components/ComponentGroup'
import React from 'react'

export const ContentfulComponentGroup = (data: IComponentGroup) => {
  return (
    <EntryMarker entry={data}>
      {() => <ComponentGroup components={data.fields.components} />}
    </EntryMarker>
  )
}
