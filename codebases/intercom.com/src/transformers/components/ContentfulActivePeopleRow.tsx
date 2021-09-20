import { IActivePeopleRowData } from 'marketing-site/src/library/components/ActivePeopleRow'
import { IActivePeopleRow as IContentfulActivePeopleRow } from 'marketing-site/@types/generated/contentful'
import { transformPriceForPeriod } from 'marketing-site/src/transformers/elements/ContentfulPriceForPeriod'

export function transformActivePeopleRow({
  fields,
}: IContentfulActivePeopleRow): IActivePeopleRowData {
  return {
    ...fields,
    essentialPriceForPeriod:
      fields.essentialPriceForPeriod && transformPriceForPeriod(fields.essentialPriceForPeriod),
    proPriceForPeriod:
      fields.proPriceForPeriod && transformPriceForPeriod(fields.proPriceForPeriod),
  }
}
