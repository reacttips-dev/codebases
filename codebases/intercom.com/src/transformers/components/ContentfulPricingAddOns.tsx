import React from 'react'
import { IProps, PricingAddOns } from 'marketing-site/src/library/components/PricingAddOns'

import { IPricingAddOns as IContentfulPricingAddOns } from 'marketing-site/@types/generated/contentful'
import { transformPricingAddOnCard } from 'marketing-site/src/transformers/components/ContentfulPricingAddOnCard'
import * as Utils from 'marketing-site/src/library/utils'
import EntryMarker from 'marketing-site/src/components/common/EntryMarker'

export const ContentfulPricingAddOns = (data: IContentfulPricingAddOns) => (
  <EntryMarker entry={data}>
    {() => <PricingAddOns {...transformPricingAddOns(data)} />}
  </EntryMarker>
)

export function transformPricingAddOns({ fields }: IContentfulPricingAddOns): IProps {
  return {
    ...fields,
    addOns: fields.addOns.map((addOn) => transformPricingAddOnCard(addOn)),
    bgColor: fields.bgColor && Utils.getHexColorFromName(fields.bgColor),
  }
}
