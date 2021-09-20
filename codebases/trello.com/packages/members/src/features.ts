import { ProductFeatures } from '@trello/product-features';

export function hasPaidOrgPowerUps(organizations?: { products: number[] }[]) {
  return organizations?.some(({ products }) =>
    products.some((code) => ProductFeatures.isFeatureEnabled('plugins', code)),
  );
}
