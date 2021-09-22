import Q from 'q';
import API from 'js/lib/api';
import URI from 'jsuri';

const couponsAPI = API('/api/coupons.v2', { type: 'rest' });

export default (promoCode) => {
  const uri = new URI();
  uri.addQueryParam('action', 'redeemPromoCode');
  uri.addQueryParam('code', promoCode);

  return Q(couponsAPI.post(uri.toString()));
};
