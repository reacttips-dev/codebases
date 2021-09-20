import { HomepageHero as HomepageHeroComponent } from './component'
import { mq, withMediaQuery } from '../../utils'

export const HomepageHero = withMediaQuery(
  // @ts-ignore
  'isMobile',
  mq.mobile,
  HomepageHeroComponent,
)

export interface IProps {
  renderEmailForm: () => React.ReactNode
  isMobile?: boolean
  headline: string
  headline2: string
}
