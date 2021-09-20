import { IProps as IFooterLink } from 'marketing-site/src/library/elements/FooterHeadingLink'
import { IFooterLinks as IContentfulFooterLink } from 'marketing-site/@types/generated/contentful'

export function transformFooterLink({ fields }: IContentfulFooterLink): IFooterLink {
  return {
    ...fields,
    text: fields.title,
  }
}
