export { FeaturesModal } from './component'
import { IProps as IEnterpriseSolutionBanner } from '../EnterpriseSolutionBanner'
import { RichText } from '../../utils'
import { IProps as IPlanGrouping } from '../PlanColumnGroup'

export const ADD_ON_OPTIONS = {
  ProcativeSupport: 'Proactive Support',
  ResolutionBot: 'Resolution bot',
  ProductTours: 'Product tours',
} as const

export type IAddOnOptions = typeof ADD_ON_OPTIONS[keyof typeof ADD_ON_OPTIONS]

export interface IFeature {
  name: string
  availableInAddOn?: boolean
  mainText?: RichText
  tooltipText?: string
  addOnOption?: IAddOnOptions
}

export interface IFeaturesGroup {
  title: string
  icon?: string
  features?: IFeature[]
  mainGrouping?: boolean
  banner?: IEnterpriseSolutionBanner
}

export interface IFeatureValue {
  featureKey: IFeature
  mainText?: string
}

export interface IProps {
  addOnLegendText?: string
  closeModal: () => void
  eventContext?: string
  featuresGroups: IFeaturesGroup[]
  footerText?: string | undefined
  headerText: string
  includedLegendText?: string
  legendTitle?: string
  modalLinkText: string
  modalOpen: boolean
  planGroupings: IPlanGrouping[]
  showLegend?: boolean
  enterpriseLegendText?: string
}
