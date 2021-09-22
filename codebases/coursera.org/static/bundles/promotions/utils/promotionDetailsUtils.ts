import Q from 'q';
import API from 'js/lib/api';
import URI from 'jsuri';

const promotionDetailsAPI = API('/api/promotionDetails.v1/', { type: 'rest' });

const promotionDetailsUtils = {
  byPromoCodeId(promoCode: string, fields: Array<string> = ['promotionName', 'discountPercent', 'startsAt', 'endsAt']) {
    const uri = new URI().addQueryParam('fields', fields.join(','));
    uri.addQueryParam('q', 'byPromoCodeId').addQueryParam('id', promoCode);
    return Q(promotionDetailsAPI.get(uri.toString()));
  },
};

export default promotionDetailsUtils;
