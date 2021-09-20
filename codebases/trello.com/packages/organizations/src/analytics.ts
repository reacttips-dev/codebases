import { ProductFeatures, PremiumFeature } from '@trello/product-features';

export const getPaidStatus = (
  premiumFeatures: PremiumFeature[],
  products: number[],
) => {
  return ProductFeatures.isEnterpriseProduct(products[0])
    ? 'enterprise'
    : ProductFeatures.isStandardProduct(products[0])
    ? 'standard'
    : ProductFeatures.isBusinessClassProduct(products[0])
    ? 'bc'
    : 'free';
};
