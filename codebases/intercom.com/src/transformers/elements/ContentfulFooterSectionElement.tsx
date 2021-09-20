import { IProps as IFooterSection } from 'marketing-site/src/library/elements/FooterSection'
import {
  IFooterSectionElement as IContentfulFooterSection,
  IFooterLinks as IContentfulFooterLink,
  IOpenMessenger as IContentfulOpenMessenger,
} from 'marketing-site/@types/generated/contentful'
import { transformFooterLink } from './ContentfulFooterLink'
import { transformOpenMessenger } from './ContentfulOpenMessenger'

export function transformFooterSection({ fields }: IContentfulFooterSection): IFooterSection {
  return {
    heading: fields.title,
    links: fields.links.map(determineLinkOrOpenMessenger),
  }
}

function isMessenger(
  item: IContentfulFooterLink | IContentfulOpenMessenger,
): item is IContentfulOpenMessenger {
  return (item as IContentfulOpenMessenger).fields.fallbackUrl !== undefined
}

function determineLinkOrOpenMessenger(item: IContentfulFooterLink | IContentfulOpenMessenger) {
  return isMessenger(item) ? transformOpenMessenger(item) : transformFooterLink(item)
}
