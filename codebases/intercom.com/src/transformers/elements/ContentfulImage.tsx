import { Asset } from 'contentful'
import { IImage as IContentfulImage } from 'marketing-site/@types/generated/contentful'
import { IProps as IImage } from 'marketing-site/src/library/elements/Image'

export function transformImage({ fields }: IContentfulImage): IImage {
  return {
    ...fields,
    url: fields.image.fields.file.url,
    width: fields.image.fields.file.details.image?.width,
    height: fields.image.fields.file.details.image?.height,
  }
}

export function transformAssetToImage({ fields }: Asset): IImage {
  return {
    url: fields.file.url,
    width: fields.file.details.image?.width,
    height: fields.file.details.image?.height,
  }
}
