import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import {
  ICardContainer as IContentfulCardContainer,
  IImage as IContentfulImage,
  ISocialProofCard as IContentfulSocialProofCard,
} from 'marketing-site/@types/generated/contentful'
import EntryMarker from 'marketing-site/src/components/common/EntryMarker'
import {
  CardContainer,
  IProps as ICardContainer,
} from 'marketing-site/src/library/components/CardContainer'
import { IProps as ISocialProofCard } from '../../library/elements/SocialProofCard/index'
import { IProps as IImage } from 'marketing-site/src/library/elements/Image'
import { transformImage } from 'marketing-site/src/transformers/elements/ContentfulImage'
import React from 'react'

export const ContentfulCardContainer = (data: IContentfulCardContainer) => {
  return (
    <EntryMarker entry={data}>
      {() => <CardContainer {...transformCardContainer(data)} />}
    </EntryMarker>
  )
}

function transformCardContainer({
  fields,
}: IContentfulCardContainer): Omit<ICardContainer, 'isMobile'> {
  return {
    ...fields,
    icon: fields.icon && transformImage(fields.icon),
    row1Cards: fields.row1Cards.map((card) => transformCard(card)),
    row2Cards: fields.row2Cards.map((card) => transformCard(card)),
  }
}

function isSocialProofCard(
  card: IContentfulSocialProofCard | IContentfulImage,
): card is IContentfulSocialProofCard {
  return card.sys.contentType.sys.id === 'socialProofCard'
}

function transformCard(
  card: IContentfulSocialProofCard | IContentfulImage,
): ISocialProofCard | IImage {
  if (isSocialProofCard(card)) {
    return transformSocialProofCard(card)
  } else {
    return transformImage(card)
  }
}

function transformSocialProofCard({ fields }: IContentfulSocialProofCard): ISocialProofCard {
  return {
    ...fields,
    content: documentToHtmlString(fields.content),
    avatar: transformImage(fields.avatar),
  }
}
