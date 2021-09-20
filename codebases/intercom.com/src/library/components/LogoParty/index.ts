import { ICTAData } from 'marketing-site/src/library/elements/CTALink'
import { IProps as ILogo } from 'marketing-site/src/library/elements/Logo'
import { HeadingStyle } from 'marketing-site/src/library/utils'
import { TextAlign } from 'marketing-site/src/library/utils/constants/textAlign'
import { AllSystemColors } from '../../utils'

export { LogoParty } from './component'

export interface IHeadingsPair {
  largeHeading: string
  smallHeading: string
}

export interface ISingleHeading {
  heading: string
  style: HeadingStyle
  magicSparklesEffectEnabled?: boolean
}

export type Headings = IHeadingsPair | ISingleHeading

export interface IProps {
  headings: Headings
  small?: boolean
  fullWidth?: boolean
  noPadding?: boolean
  textAlign: TextAlign
  bgColor: AllSystemColors
  logos: ILogo[]
  cta?: ICTAData
  opacity?: number
}
