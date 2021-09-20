import React from 'react'
import {
  IProps,
  TierPricingSection,
} from 'marketing-site/src/library/components/TierPricingSection'
import { ITierPricingSection as IContentfulTierPricingSection } from 'marketing-site/@types/generated/contentful'
import EntryMarker from 'marketing-site/src/components/common/EntryMarker'
import { transformPriceForPeriod } from '../elements/ContentfulPriceForPeriod'

export const ContentfulTierPricingSection = (data: IContentfulTierPricingSection) => (
  <EntryMarker entry={data}>
    {() => <TierPricingSection {...transformTierPricingSection(data)} />}
  </EntryMarker>
)

export function transformTierPricingSection({ fields }: IContentfulTierPricingSection): IProps {
  return {
    ...fields,
    priceForPeriod: transformPriceForPeriod(fields.priceForPeriod),
  }
}
