import productOwnershipsData from 'bundles/product/data/productOwnerships';
import ProductOwnership from 'bundles/product/models/productOwnership';

export default function (userId: $TSFixMe, productId: $TSFixMe, rawData: $TSFixMe) {
  const userProductItem = userId + '~' + productId;
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
  const promise = productOwnershipsData(userProductItem).then(function (data) {
    if (rawData) {
      return data.elements[0];
    }

    return new ProductOwnership(data.elements[0], { parse: true });
  });
  promise.done();
  return promise;
}
