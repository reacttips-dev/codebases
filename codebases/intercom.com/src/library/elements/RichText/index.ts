export { RichText } from './component'
import { Document } from '@contentful/rich-text-types'

interface IPropsWithHtmlRequired {
  html: string
  document?: Document
  behaviour?: 'Default' | 'Typography' | undefined
}

interface IPropsWithRichTextRequired {
  html?: string
  document: Document
  behaviour?: 'Default' | 'Typography' | undefined
}

export type IProps = IPropsWithHtmlRequired | IPropsWithRichTextRequired
