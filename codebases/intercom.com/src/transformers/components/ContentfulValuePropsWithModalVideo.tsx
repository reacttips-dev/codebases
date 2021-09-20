import React from 'react'
import {
  IProps,
  ValuePropsWithModalVideo,
} from 'marketing-site/src/library/components/ValuePropsWithModalVideo'
import { IValuePropsWithModalVideo as IContentfulValuePropsWithModalVideo } from 'marketing-site/@types/generated/contentful'
import EntryMarker from 'marketing-site/src/components/common/EntryMarker'
import { transformValuePropWithModalVideo } from 'marketing-site/src/transformers/elements/ContentfulValuePropWithModalVideo'

export const ContentfulValuePropsWithModalVideo = (data: IContentfulValuePropsWithModalVideo) => (
  <EntryMarker entry={data}>
    <ValuePropsWithModalVideo {...transformValuePropsWithModalVideo(data)} />
  </EntryMarker>
)

export function transformValuePropsWithModalVideo({
  fields,
}: IContentfulValuePropsWithModalVideo): IProps {
  return {
    ...fields,
    valueProps: fields.valueProps.map(transformValuePropWithModalVideo),
  }
}
