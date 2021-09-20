import { ISolutionCards as IContentfulSolutionCards } from 'marketing-site/@types/generated/contentful'
import EntryMarker from 'marketing-site/src/components/common/EntryMarker'
import {
  IProps as ISolutionCards,
  SolutionCards,
} from 'marketing-site/src/library/components/SolutionCards'
import * as Utils from 'marketing-site/src/library/utils'
import { transformSolutionCard } from 'marketing-site/src/transformers/elements/ContentfulSolutionCard'
import React from 'react'

export const ContentfulSolutionCards = (solutionCards: IContentfulSolutionCards) => {
  return (
    <EntryMarker entry={solutionCards}>
      {() => <SolutionCards {...transformSolutionCards(solutionCards)} />}
    </EntryMarker>
  )
}

export function transformSolutionCards({ fields }: IContentfulSolutionCards): ISolutionCards {
  return {
    ...fields,
    cardColor: Utils.getHexColorFromName(fields.cardColor),
    solutionCards: fields.solutionCards.map(transformSolutionCard),
  }
}
