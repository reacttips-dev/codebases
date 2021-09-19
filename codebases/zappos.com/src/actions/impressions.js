import { ON_PRIME_TWO_DAY_SHIPPING_IMPRESSION_VIEW } from 'constants/reduxActions';

export function onPrimeTwoDayShippingImpression(pageType) {
  return {
    type : ON_PRIME_TWO_DAY_SHIPPING_IMPRESSION_VIEW,
    pageType
  };
}
