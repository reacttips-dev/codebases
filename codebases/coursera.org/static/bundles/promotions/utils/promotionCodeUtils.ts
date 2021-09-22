import Q from 'q';
import API from 'js/lib/api';
import URI from 'jsuri';
import { ProductType } from 'bundles/payments/common/ProductType';
import { tupleToStringKey } from 'js/lib/stringKeyTuple';

const promoCodesAPI = API('/api/promoCodes.v1/', { type: 'rest' });

const promotionCodeUtils = {
  findAvailableForEveryonePromoByProductId(
    productType: ProductType,
    productItemId: string,
    fields: Array<string> = []
  ) {
    const uri = new URI().addQueryParam('fields', fields.join(','));
    const productId = tupleToStringKey([productType, productItemId]);
    uri.addQueryParam('q', 'findAvailableForEveryonePromoByProductId').addQueryParam('productId', productId);
    return Q(promoCodesAPI.get(uri.toString()));
  },
};

export default promotionCodeUtils;
