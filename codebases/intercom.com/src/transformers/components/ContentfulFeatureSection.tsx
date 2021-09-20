import React from 'react'
import { IProps, FeatureSection } from 'marketing-site/src/library/components/FeatureSection'
import { IFeatureSection as IContentfulFeatureSection } from 'marketing-site/@types/generated/contentful'
import EntryMarker from 'marketing-site/src/components/common/EntryMarker'
import { transformSolutionFeature } from 'marketing-site/src/transformers/components/ContentfulSolutionFeature'

export const ContentfulFeatureSection = (data: IContentfulFeatureSection) => (
  <EntryMarker entry={data}>
    {() => <FeatureSection {...transformFeatureSection(data)} />}
  </EntryMarker>
)

export function transformFeatureSection({ fields }: IContentfulFeatureSection): IProps {
  return {
    ...fields,
    solutionFeatures: fields.solutionFeatures.map((feature) => transformSolutionFeature(feature)),
  }
}
