import React from 'react'
import { IProps, PricingAddOnCard } from 'marketing-site/src/library/components/PricingAddOnCard'

import { IPricingAddOnCard as IContentfulPricingAddOnCard } from 'marketing-site/@types/generated/contentful'
import { transformFeatureList } from 'marketing-site/src/transformers/elements/ContentfulFeatureListSimple'
import {
  transformCTALink,
  passEventContextToCtaLink,
} from 'marketing-site/src/transformers/elements/ContentfulCTALink'
import { transformPriceForPeriod } from '../elements/ContentfulPriceForPeriod'
import { transformAddonPricingModal } from './ContentfulAddonPricingModal'

export const ContentfulPricingAddOnCard = (data: IContentfulPricingAddOnCard) => (
  <PricingAddOnCard {...transformPricingAddOnCard(data)} />
)

function passAnalyticsContextToCta(fields: IContentfulPricingAddOnCard['fields']) {
  passEventContextToCtaLink(fields.eventContext, fields.cta)
}

export function transformPricingAddOnCard({ fields }: IContentfulPricingAddOnCard): IProps {
  passAnalyticsContextToCta(fields)
  return {
    ...fields,
    cta: fields.cta && transformCTALink(fields.cta),
    featureList: transformFeatureList(fields.featureList),
    image: fields.image.fields.file.url,
    priceForPeriod: transformPriceForPeriod(fields.priceForPeriod),
    addOnPricingModal:
      fields.addOnPricingModal && transformAddonPricingModal(fields.addOnPricingModal),
  }
}
