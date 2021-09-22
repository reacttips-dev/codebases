import _ from 'lodash';
import { tupleToStringKey } from 'js/lib/stringKeyTuple';
import { requireFields } from 'bundles/naptimejs/util/requireFieldsDecorator';
import { subscriptionBillingType } from 'bundles/payments/common/constants';
import ProductType from 'bundles/payments/common/ProductType';
import NaptimeResource from './NaptimeResource';

const { MONTHLY, ANNUAL } = subscriptionBillingType;

class ProductSkus extends NaptimeResource {
  static RESOURCE_NAME = 'productSkus.v1';

  @requireFields('properties')
  get subscriptionType() {
    // TODO(htran): add support for `PrepaidProductProperties` once BE is ready
    const subscriptionProperties =
      this.properties && this.properties['org.coursera.product.SubscriptionProductProperties'];
    return subscriptionProperties ? subscriptionProperties.billingCycle : null;
  }

  @requireFields('properties')
  get isSubscription() {
    return _.includes([MONTHLY, ANNUAL], this.subscriptionType);
  }

  @requireFields('properties')
  get numberOfCycles() {
    // TODO(htran): add support for `PrepaidProductProperties` once BE is ready
    const subsProperties = this.properties && this.properties['org.coursera.product.SubscriptionProductProperties'];
    return subsProperties ? subsProperties.numberOfCycles : null;
  }

  static getSpecializationSubscription(s12nId, query = {}) {
    return this.get(tupleToStringKey([ProductType.SPECIALIZATION_SUBSCRIPTION, s12nId]), query);
  }

  static getSpecializationPrepaid(productItemId, query = {}) {
    return this.get(tupleToStringKey([ProductType.SPECIALIZATION_PREPAID, productItemId]), query);
  }

  static getCourseraPlusSubscription(productItemId, query = {}) {
    return this.get(tupleToStringKey([ProductType.COURSERA_PLUS_SUBSCRIPTION, productItemId]), query);
  }

  static getCredentialTrackSubscription(credentialTrackId, query = {}) {
    return this.get(tupleToStringKey([ProductType.CREDENTIAL_TRACK_SUBSCRIPTION_V2, credentialTrackId]), query);
  }

  static multiGetSpecializationSubscriptions(s12nIds, query = {}) {
    return this.multiGet(
      s12nIds.map((id) => tupleToStringKey([ProductType.SPECIALIZATION_SUBSCRIPTION, id])),
      query
    );
  }

  static findByUnderlying(s12nId, opts = {}) {
    return this.finder(
      'findByUnderlying',
      Object.assign(
        {
          params: {
            id: tupleToStringKey([ProductType.SPECIALIZATION, s12nId]),
          },
        },
        opts
      )
    );
  }
}

export default ProductSkus;
