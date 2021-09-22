import ProductType from 'bundles/payments/common/ProductType';
import { getPriceForProduct } from 'bundles/payments/promises/productPrices';

export default function (specializationId) {
  return getPriceForProduct(ProductType.SPARK_SPECIALIZATION, specializationId);
}
