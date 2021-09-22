import Uri from 'jsuri';
import courseraPlusSubscriptionsV1 from 'bundles/subscriptions/api/courseraPlusSubscriptionsV1';

export const createCart = (data: $TSFixMe) => {
  const uri = new Uri().addQueryParam('action', 'createCart');

  return courseraPlusSubscriptionsV1.post(uri.toString(), { data });
};

export const refund = (id: $TSFixMe) => {
  const uri = new Uri();
  uri.addQueryParam('action', 'refund');
  uri.addQueryParam('id', id);

  return courseraPlusSubscriptionsV1.post(uri.toString());
};
