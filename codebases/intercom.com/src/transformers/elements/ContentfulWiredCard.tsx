import { IWiredCardElement as IContentfulWiredCard } from 'marketing-site/@types/generated/contentful'
import { IProps as IWiredCard } from 'marketing-site/src/library/elements/WiredCardElement'
import * as Utils from 'marketing-site/src/library/utils'

export function transformWiredCard({ fields }: IContentfulWiredCard): IWiredCard {
  return {
    ...fields,
    title: fields?.title,
    description: fields.description,
    companyName: fields?.companyName,
    companyLogo: fields.companyLogo?.fields.file.url,
    bgColor: Utils.getHexColorFromName(fields.bgColor),
  }
}
