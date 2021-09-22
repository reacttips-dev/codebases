import URI from 'jsuri';
import credentialTrackSubscriptionsApi from 'bundles/subscriptions/api/credentialTrackSubscriptionsV1';

const createCart = (options: $TSFixMe) => {
  const uri = new URI();
  uri.addQueryParam('action', 'createCart');
  return credentialTrackSubscriptionsApi.post(uri.toString(), { data: options });
};

export default createCart;
