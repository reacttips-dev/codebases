import { ICheckmarks as IContentfulCheckmarks } from 'marketing-site/@types/generated/contentful'
import { IProps as ICheckmarks } from 'marketing-site/src/library/elements/CheckMarks'

export function transformCheckmarks({ fields }: IContentfulCheckmarks): ICheckmarks {
  return {
    ...fields,
    items: fields.checkmarkText as [string, string, string],
    vertical: fields.vertical === true,
  }
}
