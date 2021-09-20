import { IWhatsIncludedDrawerData } from 'marketing-site/src/library/elements/WhatsIncludedDrawer'

import { IWhatsIncludedItem as IContentful } from 'marketing-site/@types/generated/contentful'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { transformImage } from './ContentfulImage'

export function transformWhatsIncludedItem({ fields }: IContentful): IWhatsIncludedDrawerData {
  return {
    ...fields,
    title: fields.productName,
    description: fields.descriptionRichText && documentToHtmlString(fields.descriptionRichText),
    imageRef: transformImage(fields.imageRef),
    icon: fields.icon.fields.file.url,
    lightIcon: fields.lightIcon?.fields.file.url,
    video: fields.video && fields.video.fields.file.url,
    videoWebm: fields.videoWebm && fields.videoWebm.fields.file.url,
    playOnce: fields.playOnce,
  }
}
