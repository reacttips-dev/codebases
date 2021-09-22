import NaptimeResource from './NaptimeResource';

export type DiscountAmount = { [currencyCode: string]: number };
class PromotionDetails extends NaptimeResource {
  static RESOURCE_NAME = 'promotionDetails.v1';

  // These properties are always included.
  id!: string;

  // These properties must be requested.
  promotionName?: string;

  promotionDescription?: string;

  discountPercent?: number;

  discountAmount?: DiscountAmount;

  startsAt?: number;

  endsAt?: number;

  promotionId?: number;

  static byPromoCodeId(id: string, opts: { [key: string]: string | number | boolean | Array<string> }) {
    return this.finder('byPromoCodeId', Object.assign({ params: { id } }, opts), (promoDetails) => promoDetails?.[0]);
  }
}

export default PromotionDetails;
