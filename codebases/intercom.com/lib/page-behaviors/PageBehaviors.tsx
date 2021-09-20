import React from 'react'
import { IPageBehavior, IPageBehaviorFields } from 'marketing-site/@types/generated/contentful'

import CareersLocation from './CareersLocation'
import CareersPage from './CareersPage'
import CdaUpdater from './CdaUpdater'
import ChatbotSurveyPage from './ChatbotSurveryPage'
import EarlyStage from './EarlyStage'
import ExitIntentModal from './ExitIntentModal'
import G2Page from './G2Page'
import HomepageDIS from './HomepageDIS'
import MobilePage from './MobilePage'
import PricingPage from './PricingPage'
import ResolutionBotLP from './ResolutionBotLP'
import WhatIsIntercom from './WhatIsIntercom'
import CustomStyles from './CustomStyles'
import MobileCarousels from './MobileCarousels'
import CSFPage from './CSFPage'
import InboundPage from './InboundPage'
import BookCustomDemo from './BookCustomDemo'

export interface IPageBehaviorComponentProps {
  id: string
  data: IPageBehaviorFields
  children: React.ReactNode
}

type IPageBehaviorComponent = (props: IPageBehaviorComponentProps) => JSX.Element

const pageBehaviorsByIdentifier: Record<
  IPageBehavior['fields']['identifier'],
  IPageBehaviorComponent
> = {
  'careers-location': CareersLocation,
  'careers-page': CareersPage,
  'cda-updater': CdaUpdater,
  'chatbot-survey-page': ChatbotSurveyPage,
  'csf-page': CSFPage,
  'custom-styles': CustomStyles,
  'early-stage': EarlyStage,
  'exit-intent-modal': ExitIntentModal,
  'g2-page': G2Page,
  'homepage-dis': HomepageDIS,
  'mobile-carousels': MobileCarousels,
  'mobile-page': MobilePage,
  'pricing-page': PricingPage,
  'resolution-bot-lp': ResolutionBotLP,
  'what-is-intercom': WhatIsIntercom,
  'inbound-page': InboundPage,
  'book-custom-demo': BookCustomDemo,
}

interface IPageBehaviors {
  pageBehaviors: IPageBehavior[]
  children: React.ReactNode
}

export default function PageBehaviors({ pageBehaviors, children }: IPageBehaviors) {
  let tree = children

  pageBehaviors.forEach((pageBehavior) => {
    const PageBehaviorComponent = pageBehaviorsByIdentifier[pageBehavior.fields.identifier]
    tree = (
      <PageBehaviorComponent id={pageBehavior.sys.id} data={pageBehavior.fields}>
        {tree}
      </PageBehaviorComponent>
    )
  })

  return <>{tree}</>
}
