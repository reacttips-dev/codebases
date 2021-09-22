import Q from 'q';
import productOwnershipsApi from 'bundles/product/api/productOwnerships';

export default function (userProductItem: $TSFixMe, options: $TSFixMe) {
  return Q(productOwnershipsApi.get(userProductItem, options || {}));
}
