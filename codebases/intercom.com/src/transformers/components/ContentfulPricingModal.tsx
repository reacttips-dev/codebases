import React from 'react'
import {
  IProps as IPricingModal,
  PricingModal,
} from 'marketing-site/src/library/components/PricingModal'
import { IPricingModal as IContentfulPricingModal } from 'marketing-site/@types/generated/contentful'
import EntryMarker from 'marketing-site/src/components/common/EntryMarker'
import { transformCTAWithText } from './ContentfulHowPricingWorks'

export const ContentfulPricingModal = (pricingModal: IContentfulPricingModal) => (
  <EntryMarker entry={pricingModal}>
    {() => <PricingModal {...transformPricingModal(pricingModal)} />}
  </EntryMarker>
)

export function transformPricingModal({ fields }: IContentfulPricingModal): IPricingModal {
  return {
    ...fields,
    priceMetrics: fields.priceMetrics && fields.priceMetrics.map(({ fields }: any) => fields),
    ctaWithText: fields.ctaWithText && transformCTAWithText(fields.ctaWithText),
  }
}
