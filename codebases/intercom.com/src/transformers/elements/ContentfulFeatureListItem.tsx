import { IProps as FeatureListItem } from 'marketing-site/src/library/elements/FeatureListItem'
import { IFeatureListItem as IContentfulFeatureListItem } from 'marketing-site/@types/generated/contentful'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'

// Transformer Function
export function transformFeatureListItem({ fields }: IContentfulFeatureListItem): FeatureListItem {
  return {
    ...fields,
    richText: documentToHtmlString(fields.richText),
  }
}
