import React from 'react'
import {
  IProps as IWiredCards,
  WiredCardsComponent,
} from 'marketing-site/src/library/components/WiredCardsComponent'
import { IWiredCardsComponent as IContentfulWiredCards } from 'marketing-site/@types/generated/contentful'
import { transformWiredCard } from 'marketing-site/src/transformers/elements/ContentfulWiredCard'
import EntryMarker from 'marketing-site/src/components/common/EntryMarker'

export const ContentfulWiredCards = (wiredCards: IContentfulWiredCards) => {
  return (
    <EntryMarker entry={wiredCards}>
      {() => <WiredCardsComponent {...transformWiredCards(wiredCards)} />}
    </EntryMarker>
  )
}

export function transformWiredCards({ fields }: IContentfulWiredCards): IWiredCards {
  return {
    ...fields,
    cards: fields.cards.map(transformWiredCard),
  }
}
