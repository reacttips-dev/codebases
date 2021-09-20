import React from 'react'
import EntryMarker from 'marketing-site/src/components/common/EntryMarker'
import {
  FeatureListSimple,
  IProps as FeatureListSimpleProps,
} from 'marketing-site/src/library/elements/FeatureListSimple'
import { IFeatureListSimple as IContentfulFeatureListSimple } from 'marketing-site/@types/generated/contentful'

import { transformFeatureListItem } from 'marketing-site/src/transformers/elements/ContentfulFeatureListItem'

export const ContentfulFeatureList = (featureList: IContentfulFeatureListSimple) => (
  <EntryMarker entry={featureList}>
    {() => <FeatureListSimple {...transformFeatureList(featureList)} />}
  </EntryMarker>
)

export function transformFeatureList({
  fields,
}: IContentfulFeatureListSimple): FeatureListSimpleProps {
  return {
    items: fields.features.map((data) => transformFeatureListItem(data)),
  }
}
