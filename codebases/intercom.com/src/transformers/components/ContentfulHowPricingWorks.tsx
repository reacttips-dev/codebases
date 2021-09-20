import {
  IHowPricingWorks as IContentfulHowPricingWorks,
  ICtaWithText,
} from 'marketing-site/@types/generated/contentful'
import { transformTierPricingSection } from 'marketing-site/src/transformers/components/ContentfulTierPricingSection'
import { transformActivePeopleRow } from 'marketing-site/src/transformers/components/ContentfulActivePeopleRow'
import { IHowPricingWorksModalData } from 'marketing-site/src/library/components/HowPricingWorksModal'
import { transformCTALink } from 'marketing-site/src/transformers/elements/ContentfulCTALink'

export function transformCTAWithText({ fields }: ICtaWithText) {
  return {
    cta: transformCTALink(fields.cta),
    text: fields.text,
  }
}

export function transformHowPricingWorks({
  fields,
}: IContentfulHowPricingWorks): IHowPricingWorksModalData {
  return {
    ...fields,
    chatWithUsCta: fields.chatWithUsCta && transformCTALink(fields.chatWithUsCta),
    footNoteCTAs:
      fields.footNoteCTAs && fields.footNoteCTAs.map((data) => transformCTAWithText(data)),
    essentialCta: fields.essentialCta && transformCTALink(fields.essentialCta),
    proCta: fields.proCta && transformCTALink(fields.proCta),
    tierSeatSections: fields.tierSeatSections.map((section) =>
      transformTierPricingSection(section),
    ),
    activePeopleRows: fields.activePeopleRows.map((row) => transformActivePeopleRow(row)),
  }
}
