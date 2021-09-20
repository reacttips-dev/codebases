import React from 'react'
import {
  IProps,
  PlanColumnGroupLayout,
} from 'marketing-site/src/library/components/PlanColumnGroupLayout'

import {
  IPlanColumnGroupLayout as IContentfulPlanColumnGroupLayout,
  IPricingModal,
  IPricingTable,
} from 'marketing-site/@types/generated/contentful'
import * as Utils from 'marketing-site/src/library/utils'
import { transformPlanColumnGroup } from './ContentfulPlanColumnGroup'
import { transformPricingTable } from '../ContentfulPricingTable'
import { transformFeaturesModal } from '../ContentfulFeaturesModal'
import { transformPricingModal } from './ContentfulPricingModal'
import { transformEnterpriseSolutionBanner } from './ContentfulEnterpriseSolutionBanner'

export const ContentfulPlanColumnGroupLayout = (fields: IContentfulPlanColumnGroupLayout) => (
  <PlanColumnGroupLayout {...transformPlanColumnGroupLayout(fields)} />
)

export function transformPlanColumnGroupLayout({
  fields,
}: IContentfulPlanColumnGroupLayout): IProps {
  return {
    ...fields,
    tabHeading: fields.tabHeading || '',
    tabColor: fields.tabColor && Utils.getHexColorFromName(fields.tabColor),
    bgColor: fields.bgColor && Utils.getHexColorFromName(fields.bgColor),
    planColumnGroups:
      fields.planColumnGroups && fields.planColumnGroups.map(transformPlanColumnGroup),
    pricingModal: fields.pricingModal && transformPricingModalOptions(fields.pricingModal),
    featuresModalData: fields.featuresModalData && transformFeaturesModal(fields.featuresModalData),
    banner: fields.banner && transformEnterpriseSolutionBanner(fields.banner),
    withMagicSparkles: fields.withMagicSparkles && fields.withMagicSparkles,
  }
}

type IPricingModalOptions = IPricingTable | IPricingModal

const transformPricingModalOptions = (pricingModal: IPricingModalOptions) => {
  if ((pricingModal as IPricingTable).fields.planGroupings)
    return transformPricingTable(pricingModal as IPricingTable)
  return transformPricingModal(pricingModal as IPricingModal)
}
