import URI from 'jsuri';
import subscriptionsApi from 'bundles/subscriptions/api/subscriptionsV1';
import memoize from 'js/lib/memoize';
import path from 'js/lib/path';

export const cancel = (id: $TSFixMe) => {
  const uri = new URI();
  uri.addQueryParam('action', 'cancel');
  uri.addQueryParam('id', id);

  return subscriptionsApi.post(uri.toString());
};

export const invalidate = (id: $TSFixMe) => {
  const uri = new URI();
  uri.addQueryParam('action', 'invalidate');
  uri.addQueryParam('id', id);

  return subscriptionsApi.post(uri.toString());
};

export const refund = (id: $TSFixMe) => {
  const uri = new URI();
  uri.addQueryParam('action', 'refund');
  uri.addQueryParam('id', id);

  return subscriptionsApi.post(uri.toString());
};

export const createCart = (options: $TSFixMe) => {
  const uri = new URI();
  uri.addQueryParam('action', 'createCart');
  return subscriptionsApi.post(uri.toString(), { data: options });
};
