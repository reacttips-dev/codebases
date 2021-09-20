import React from 'react'
import {
  IProps,
  EditorialStoryGrid,
} from 'marketing-site/src/library/components/EditorialStoryGrid'

import { ICustomerStoryGrid as IContentfulEditorialStoryGrid } from 'marketing-site/@types/generated/contentful'
import { transformEditorialStory } from 'marketing-site/src/transformers/elements/ContentfulEditorialStory'
import EntryMarker from 'marketing-site/src/components/common/EntryMarker'

export const ContentfulCustomerStoryGrid = (data: IContentfulEditorialStoryGrid) => (
  <EntryMarker entry={data}>
    {() => <EditorialStoryGrid {...transformCustomerStoryGrid(data)} />}
  </EntryMarker>
)

export function transformCustomerStoryGrid({ fields }: IContentfulEditorialStoryGrid): IProps {
  return {
    ...fields,
    cards: fields.cards.map(transformEditorialStory),
  }
}
