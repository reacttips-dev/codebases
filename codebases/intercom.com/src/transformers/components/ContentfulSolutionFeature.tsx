import React from 'react'
import { IProps, SolutionFeature } from 'marketing-site/src/library/components/SolutionFeature'
import { ISolutionFeature as IContentfulSolutionFeature } from 'marketing-site/@types/generated/contentful'
import EntryMarker from 'marketing-site/src/components/common/EntryMarker'

export const ContentfulSolutionFeature = (data: IContentfulSolutionFeature) => (
  <EntryMarker entry={data}>
    {() => <SolutionFeature {...transformSolutionFeature(data)} />}
  </EntryMarker>
)

export function transformSolutionFeature({ fields }: IContentfulSolutionFeature): IProps {
  return {
    ...fields,
  }
}
