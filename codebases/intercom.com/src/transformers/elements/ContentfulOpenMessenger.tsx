import { IOpenMessenger } from 'marketing-site/src/library/elements/FooterSection'
import { IOpenMessenger as IContentfulOpenMessenger } from 'marketing-site/@types/generated/contentful'

export function transformOpenMessenger({ fields }: IContentfulOpenMessenger): IOpenMessenger {
  return {
    text: fields.title,
    url: fields.fallbackUrl,
    openMessenger: true,
  }
}
