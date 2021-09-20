import { ICustomerStory as IContentfulEditorialStory } from 'marketing-site/@types/generated/contentful'
import { IProps } from 'marketing-site/src/library/elements/EditorialStory'
import { transformCTALink, transformCTAWithBackground } from './ContentfulCTALink'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { transformImage } from './ContentfulImage'

export function transformEditorialStory({ fields }: IContentfulEditorialStory): IProps {
  return {
    title: documentToHtmlString(fields.titleRichText),
    body: fields.bodyText,
    cta: fields.cta && transformCTAWithBackground(fields.cta),
    tags: fields.tags && fields.tags.map(transformCTALink),
    imageRef: transformImage(fields.imageRef),
    eyebrow: fields.eyebrow,
  }
}
