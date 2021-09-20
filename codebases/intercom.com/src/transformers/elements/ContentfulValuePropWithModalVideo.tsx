import { IProps } from 'marketing-site/src/library/elements/ValuePropWithModalVideo'
import { IValuePropWithModalVideo as IContentfulValuePropWithModalVideo } from 'marketing-site/@types/generated/contentful'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { transformVideoPlayer } from './ContentfulVideoPlayer'

export function transformValuePropWithModalVideo({
  fields,
}: IContentfulValuePropWithModalVideo): IProps {
  return {
    ...fields,
    modalContent: fields.modalContent && documentToHtmlString(fields.modalContent),
    video: fields.video && transformVideoPlayer(fields.video),
  }
}
