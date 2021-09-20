import { IProps as ICapabilitiesCarouselSlide } from 'marketing-site/src/library/components/CapabilitiesCarouselSlide/index'
import { mq, withMediaQuery } from 'marketing-site/src/library/utils'
import { CapabilitiesCarousel as CapabilitiesCarouselComponent } from './component'

export const CapabilitiesCarousel = withMediaQuery(
  // @ts-ignore
  'isMobile',
  mq.mobile,
  CapabilitiesCarouselComponent,
)

export interface IProps {
  slides: ICapabilitiesCarouselSlide[]
}
