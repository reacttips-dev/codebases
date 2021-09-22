import { requireFields } from 'bundles/naptimejs/util/requireFieldsDecorator';
import ProductType from 'bundles/payments/common/ProductType';
import { S12nDerivativesV1NaptimeResource } from './__generated__/S12nDerivativesV1';

class S12nDerivatives extends S12nDerivativesV1NaptimeResource {
  static RESOURCE_NAME = 's12nDerivatives.v1' as const;

  @requireFields('catalogPrice')
  get isSubscription() {
    const { catalogPrice } = this;
    return catalogPrice && catalogPrice.productType === ProductType.SPECIALIZATION_SUBSCRIPTION;
  }
}

export default S12nDerivatives;
