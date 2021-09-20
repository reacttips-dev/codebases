import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import {
  ICtaButton as IContentfulCtaButton,
  ICtaLink as IContentfulCtaLink,
  IFeatureValue as IContentfulFeatureValue,
  IPriceMetricValue as IContentfulPriceMetricValues,
  IPricingTierCard as IContentfulPricingTierCard,
} from 'marketing-site/@types/generated/contentful'
import EntryMarker from 'marketing-site/src/components/common/EntryMarker'
import {
  IContentfulPricingTierCardProps,
  PricingTierCard,
} from 'marketing-site/src/library/components/PricingTierCard'
import * as Utils from 'marketing-site/src/library/utils'
import { transformFeatures } from 'marketing-site/src/transformers/ContentfulFeaturesModal'
import {
  isCTAButton,
  transformCTAButton,
} from 'marketing-site/src/transformers/elements/ContentfulCTAButton'
import { transformFeatureList } from 'marketing-site/src/transformers/elements/ContentfulFeatureListSimple'
import { transformPriceForPeriod } from 'marketing-site/src/transformers/elements/ContentfulPriceForPeriod'
import React from 'react'
import { CTAButton } from '../../library/elements/CTAButton'
import { CTALink, IProps as ICtaLinkProps } from '../../library/elements/CTALink'
import {
  isCTALink,
  passEventContextToCtaLink,
  transformCTAWithBackground,
} from '../elements/ContentfulCTALink'

export const ContentfulPricingTierCard = (fields: IContentfulPricingTierCard) => (
  <PricingTierCard {...transformPricingTierCard(fields)} />
)

export function transformCTAWithBackgroundOverride(
  cta: IContentfulCtaLink,
  bgColor: ICtaLinkProps['bgColor'],
): ICtaLinkProps {
  return {
    ...transformCTAWithBackground(cta),
    bgColor,
  }
}

function renderGenericCTA(cta: IContentfulCtaLink | IContentfulCtaButton, ctaTheme: string) {
  const bgColor = Utils.getTypedCtaTheme<Utils.CTATheme>(ctaTheme)
  if (isCTALink(cta)) {
    return (
      <CTALink wide={true} textSize="body+" {...transformCTAWithBackgroundOverride(cta, bgColor)} />
    )
  } else if (isCTAButton(cta)) {
    return <CTAButton {...transformCTAButton(cta as IContentfulCtaButton)} />
  }
}

function passAnalyticsContextToCta(fields: IContentfulPricingTierCard['fields']) {
  passEventContextToCtaLink(fields.eventContext, fields.cta as IContentfulCtaLink)
}

export function transformPriceMetricValues({ fields }: IContentfulPriceMetricValues) {
  return {
    ...fields,
    key: fields.key.fields,
  }
}

export function transformFeatureValues({ fields }: IContentfulFeatureValue) {
  return {
    ...fields,
    featureKey: transformFeatures(fields.featureKey),
  }
}

export function transformPricingTierCard({
  fields,
}: IContentfulPricingTierCard): IContentfulPricingTierCardProps {
  passAnalyticsContextToCta(fields)
  return {
    ...fields,
    renderCta: () => (
      <EntryMarker entry={fields.cta}>
        {() => renderGenericCTA(fields.cta, fields.ctaTheme)}
      </EntryMarker>
    ),
    ctaProps: transformCTAWithBackgroundOverride(
      fields.cta as IContentfulCtaLink,
      Utils.getTypedCtaTheme<Utils.CTATheme>(fields.ctaTheme),
    ),
    solutionFeaturesModalData: undefined,
    badgeIcon: fields.badgeIcon && fields.badgeIcon.fields.file.url,
    headerIcon: fields.headerIcon && fields.headerIcon.fields.file.url,
    borderColor: fields.borderColor && Utils.getHexColorFromName(fields.borderColor),
    featureListTitleRichText:
      fields.featureListTitleRichText && documentToHtmlString(fields.featureListTitleRichText),
    featureList: fields.featureList && transformFeatureList(fields.featureList),
    priceForPeriod: fields.priceForPeriod && transformPriceForPeriod(fields.priceForPeriod),
    priceMetricValues:
      fields.pricingMetricValues && fields.pricingMetricValues.map(transformPriceMetricValues),
    featureValues: fields.featureValues && fields.featureValues.map(transformFeatureValues),
  }
}
