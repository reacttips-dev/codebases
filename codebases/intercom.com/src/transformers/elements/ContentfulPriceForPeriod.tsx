import { IPriceForPeriod } from 'marketing-site/src/library/elements/PriceForPeriod'
import { IPriceForPeriod as IContentfulPriceForPeriod } from 'marketing-site/@types/generated/contentful'

export function transformPriceForPeriod({ fields }: IContentfulPriceForPeriod): IPriceForPeriod {
  return {
    ...fields,
    price: fields.price,
  }
}
