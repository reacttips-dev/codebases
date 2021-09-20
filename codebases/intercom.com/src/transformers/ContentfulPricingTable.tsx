import React from 'react'
import { IProps as IPricingTable } from 'marketing-site/src/library/components/PricingTable'
import { IPricingTable as IContentfulPricingTable } from 'marketing-site/@types/generated/contentful'
import { PricingTable } from 'marketing-site/src/library/components/PricingTable'
import { transformPlanColumnGroup } from './components/ContentfulPlanColumnGroup'
import { transformCTAWithText } from './components/ContentfulHowPricingWorks'

export const ContentfulPricingTable = (pricingTable: IContentfulPricingTable) => (
  <PricingTable {...transformPricingTable(pricingTable)} />
)

export function transformPricingTable({ fields }: IContentfulPricingTable): IPricingTable {
  return {
    ...fields,
    priceMetrics: fields.priceMetrics.map(({ fields }) => fields),
    planGroupings:
      (fields.planGroupColumns && fields.planGroupColumns.map(transformPlanColumnGroup)) || [],
    earlyStageCta: fields.earlyStageCta && transformCTAWithText(fields.earlyStageCta),
  }
}
