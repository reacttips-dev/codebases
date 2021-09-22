import { requireFields } from 'bundles/naptimejs/util/requireFieldsDecorator';
import ProductType from 'bundles/payments/common/ProductType';
import NaptimeResource from './NaptimeResource';

class SubscriptionTrials extends NaptimeResource {
  static RESOURCE_NAME = 'subscriptionTrials.v1';

  @requireFields('productType')
  get isSpecializationSubscription() {
    return this.productType === ProductType.SPECIALIZATION;
  }

  static findByUser(userId, data) {
    return this.finder('findByUser', Object.assign({ params: { userId } }, data));
  }
}

export default SubscriptionTrials;
