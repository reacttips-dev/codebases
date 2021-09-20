import { ILink } from 'marketing-site/src/components/bespoke/resources/link'
export { LearnLinks } from './component'

export enum LinkLabels {
  Demo,
  Article,
  Book,
  Guide,
  Podcast,
  Video,
  CustomerStory = 'Customer story',
}

export const getLabelByKey = (key: string | undefined): LinkLabels => {
  if (LinkLabels.CustomerStory === key) return LinkLabels.CustomerStory

  for (const index in LinkLabels) {
    if (LinkLabels[index] === key) {
      return LinkLabels[index] as LinkLabels
    }
  }
  const { Article: articleIndex } = LinkLabels
  const articleAsDefault = LinkLabels[articleIndex] as LinkLabels
  return articleAsDefault
}

export interface IProps {
  headline: string | undefined
  ctaUrl?: string | undefined
  viewAll?: string | undefined
  appearance?: 'Large Cards' | 'Small Cards' | 'Embedded'
  background: string
  links: (ILink | null)[] | undefined
  asFullGrid?: boolean
}
