import ProductType from 'bundles/payments/common/ProductType';
import { getPricesForProducts } from 'bundles/payments/promises/productPrices';

export default function (courses) {
  const vcProducts = courses.map((course) => {
    return {
      productType: ProductType.SPARK_COURSE_SHELL,
      productTypeId: course.get('id'),
    };
  });

  return getPricesForProducts(vcProducts);
}
