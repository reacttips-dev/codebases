// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import PromotionEligibilityTypes from 'bundles/promotions/common/PromotionEligibilityTypes';

import { requireFields } from 'bundles/naptimejs/util/requireFieldsDecorator';
import NaptimeResource from './NaptimeResource';

class PromotionEligibilities extends NaptimeResource {
  static RESOURCE_NAME = 'promotionEligibilities.v1';

  // These properties are always included.
  id!: string;
  promoCodeId!: string;
  productId!: string;

  // These properties must be requested.
  eligibilityCode?: string;

  @requireFields('eligibilityCode')
  get isEligible(): boolean {
    return this.eligibilityCode === PromotionEligibilityTypes.ELIGIBLE;
  }

  @requireFields('eligibilityCode')
  get isProductNotEligible(): boolean {
    return this.eligibilityCode === PromotionEligibilityTypes.PRODUCT_NOT_ELIGIBLE;
  }
}

export default PromotionEligibilities;
