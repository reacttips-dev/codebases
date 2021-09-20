import React from 'react'
import { IProps, PlanColumnGroup } from 'marketing-site/src/library/components/PlanColumnGroup'

import { IPlanColumnGroup as IContentfulPlanColumnGroup } from 'marketing-site/@types/generated/contentful'
import * as Utils from 'marketing-site/src/library/utils'
import { IPricingTierCard as IContentfulPricingTierCard } from 'marketing-site/@types/generated/contentful'
import { transformPricingTierCard } from './ContentfulPricingTierCard'

export const ContentfulPlanColumnGroup = (group: IContentfulPlanColumnGroup) => (
  <PlanColumnGroup {...transformPlanColumnGroup(group)} />
)

export function transformPlanColumnGroup({ fields }: IContentfulPlanColumnGroup): IProps {
  return {
    ...fields,
    headerBgColor: fields.headerBgColor && Utils.getHexColorFromName(fields.headerBgColor),
    altHeaderBgColor: fields.altHeaderBgColor && Utils.getHexColorFromName(fields.altHeaderBgColor),
    plans: fields.children.map((card) =>
      transformPricingTierCard(card as IContentfulPricingTierCard),
    ),
  }
}
