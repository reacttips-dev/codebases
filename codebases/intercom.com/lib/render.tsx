import { Entry } from 'contentful'
import { CONTENT_TYPE, IPage } from 'marketing-site/@types/generated/contentful'
import { captureException } from 'marketing-site/lib/sentry'
import {
  renderTransformedComponent,
  TRANSFORMED_COMPONENTS,
} from 'marketing-site/lib/transformedComponents'
import EntryMarker from 'marketing-site/src/components/common/EntryMarker'
import React from 'react'

export function renderEntry(entry: Entry<{}>) {
  if (!entry) {
    return null
  }

  const contentType = entry.sys.contentType.sys.id as CONTENT_TYPE

  if (contentType in TRANSFORMED_COMPONENTS) {
    return renderTransformedComponent(contentType, entry)
  } else {
    captureException(
      new Error(`Tried to render an unmapped component with contentType=${contentType}`),
    )
    return null
  }
}

export function renderBodyContent(bodyContentResponse: IPage['fields']['bodyContent']) {
  return (
    bodyContentResponse &&
    bodyContentResponse.map((entry: Entry<{}>, index: number) => (
      <EntryMarker entry={entry} key={index}>
        {() => renderEntry(entry)}
      </EntryMarker>
    ))
  )
}
