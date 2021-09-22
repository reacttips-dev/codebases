import { getPriceForSpecialization } from 'bundles/payments/promises/productPrices';

export default (s12nId) => {
  const promise = getPriceForSpecialization({ specializationId: s12nId });
  promise.done();
  return promise;
};
