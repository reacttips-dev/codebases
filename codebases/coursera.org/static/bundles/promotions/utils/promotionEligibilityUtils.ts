import Q from 'q';
import API from 'js/lib/api';
import URI from 'jsuri';

const promotionEligibilitiesAPI = API('/api/promotionEligibilities.v1/', { type: 'rest' });

const promotionEligibilitiesUtils = {
  // ex. NEXTExtended~SpecializationSubscription~123abc
  get(promoProductSku: string, fields: Array<string> = ['eligibilityCode', 'promoCodeId']) {
    const uri = new URI().setPath(promoProductSku);
    uri.addQueryParam('fields', fields.join(','));

    return Q(promotionEligibilitiesAPI.get(uri.toString()));
  },
};

export default promotionEligibilitiesUtils;
