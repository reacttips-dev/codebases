import { ILogo as IContentfulLogo } from 'marketing-site/@types/generated/contentful'
import { IProps as ILogo } from 'marketing-site/src/library/elements/Logo'

export function transformLogo({ fields }: IContentfulLogo): ILogo {
  return {
    ...fields,
    logoUrl: fields.logoUrl.fields.file.url,
    width: fields.logoUrl.fields.file.details.image?.width,
    height: fields.logoUrl.fields.file.details.image?.height,
  }
}
