import { Entry } from 'contentful'
import { IComponentGroupFields } from 'marketing-site/@types/generated/contentful'
import { renderEntry } from 'marketing-site/lib/render'
import EntryMarker from 'marketing-site/src/components/common/EntryMarker'
import React from 'react'

export function ComponentGroup({ components }: IComponentGroupFields) {
  return (
    <>
      {components.map((entry: Entry<{}>, index: number) => (
        <EntryMarker entry={entry} key={index}>
          {renderEntry(entry)}
        </EntryMarker>
      ))}
    </>
  )
}
