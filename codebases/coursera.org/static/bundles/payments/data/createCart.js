import cartsApi from 'bundles/payments/api/carts';
import Q from 'q';

export default function (options) {
  return Q(cartsApi.post('', { data: options }));
}
