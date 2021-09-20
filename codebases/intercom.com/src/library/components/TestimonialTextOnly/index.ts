import { mq, RichText, withMediaQuery } from '../../utils'
import { TestimonialTextOnly as TestimonialTextOnlyPure } from './component'
import { IProps as IImage } from '../../elements/Image'

export const TestimonialTextOnly = withMediaQuery('isMobile', mq.mobile, TestimonialTextOnlyPure)

export interface IProps {
  headline?: string
  quote: string
  result: string
  resultCopy: RichText
  resultLink?: RichText
  resultLogo?: string
  hasQuotationMark?: boolean
  isMobile: boolean
  avatar?: IImage
}
