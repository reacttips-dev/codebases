import { ISolutionCard as IContentfulSolutionCard } from 'marketing-site/@types/generated/contentful'
import { ISolutionCardProps as ISolutionCard } from 'marketing-site/src/library/components/SolutionCards'
import { transformCTALink } from 'marketing-site/src/transformers/elements/ContentfulCTALink'
import { transformAssetToImage } from './ContentfulImage'

// Transformer Function
export function transformSolutionCard({ fields }: IContentfulSolutionCard): ISolutionCard {
  return {
    ...fields,
    title: fields.title,
    body: fields.bodyText,
    staticImage: transformAssetToImage(fields.image),
    animatedImage: fields.animatedImage && transformAssetToImage(fields.animatedImage),
    cta: fields.cta ? transformCTALink(fields.cta) : undefined,
  }
}
