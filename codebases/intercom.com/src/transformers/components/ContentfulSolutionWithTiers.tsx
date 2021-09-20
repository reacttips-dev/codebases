import React from 'react'
import {
  IProps as ISolutionWithTiersProps,
  SolutionWithTiers,
} from 'marketing-site/src/library/components/SolutionWithTiers'
import * as Utils from 'marketing-site/src/library/utils'
import { ISolutionWithTiers as IContentfulSolutionWithTiers } from 'marketing-site/@types/generated/contentful'
import EntryMarker from 'marketing-site/src/components/common/EntryMarker'
import { transformPricingTierCard } from 'marketing-site/src/transformers/components/ContentfulPricingTierCard'
import { transformProductList } from 'marketing-site/src/transformers/elements/ContentfulProductList'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { transformHowPricingWorks } from './ContentfulHowPricingWorks'
import { transformSolutionFeatures } from './ContentfulSolutionFeatures'
import { transformPricingAddOns } from './ContentfulPricingAddOns'

export const ContentfulSolutionWithTiers = (data: IContentfulSolutionWithTiers) => (
  <EntryMarker entry={data}>
    {() => <SolutionWithTiers {...transformSolutionWithTiers(data)} />}
  </EntryMarker>
)

export function transformSolutionWithTiers({
  fields,
}: IContentfulSolutionWithTiers): ISolutionWithTiersProps {
  return {
    ...fields,
    tiers: fields.tiers.map(transformPricingTierCard),
    color: Utils.getHexColorFromName(fields.color),
    footnote: fields.footnote && documentToHtmlString(fields.footnote),
    productList: transformProductList(fields.productList),
    addOnsList: fields.addOnsList && transformProductList(fields.addOnsList),
    howPricingWorks: transformHowPricingWorks(fields.howPricingWorks),
    solutionFeatures: Object.assign({}, transformSolutionFeatures(fields.solutionFeatures), {
      tiers: fields.tiers.map((tier) => transformPricingTierCard(tier)),
      customPriceText: fields.customPriceText,
      modalLinkText: fields.featuresLinkText,
    }),
    addOnsSection: transformPricingAddOns(fields.addOnsSection),
    icon: fields.icon.fields.file.url,
  }
}
