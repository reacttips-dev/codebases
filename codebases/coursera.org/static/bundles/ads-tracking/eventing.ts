import Q from 'q';
import _ from 'lodash';
import AdsTracker from 'bundles/ads-tracking/tracker';
import Multitracker from 'js/app/multitrackerSingleton';

function Eventing(...args: $TSFixMe[]) {
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  AdsTracker.apply(this, args);
}

// @ts-ignore ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
Eventing.prototype = new AdsTracker();

Eventing.prototype.send = function (params: $TSFixMe) {
  const deferred = Q.defer();
  Multitracker.push(['adstracker.' + params.key, _.omit(params, 'key'), deferred.resolve]);
  return deferred.promise;
};

Eventing.prototype.prepareParams = function (key: $TSFixMe, additionalData: $TSFixMe) {
  return _.extend({ key }, additionalData);
};

Eventing.prototype.trackSignup = function (userId: $TSFixMe) {
  return this.track('signup');
};

Eventing.prototype.trackEnroll = function (userId: $TSFixMe) {
  return this.track('enroll');
};

Eventing.prototype._trackPaymentEvent = function (
  eventName: $TSFixMe,
  userId: $TSFixMe,
  paymentsInfo: $TSFixMe,
  orderId: $TSFixMe
) {
  paymentsInfo = _.isArray(paymentsInfo) ? paymentsInfo : [paymentsInfo];
  const promises = _.map(paymentsInfo, (paymentInfo) => {
    return this.track(eventName, {
      id: paymentInfo.id,
      value: parseInt(paymentInfo && paymentInfo.value, 10),
    });
  });
  return Q.allSettled(promises);
};

Eventing.prototype.trackS12NBulkPayment = function (userId: $TSFixMe, paymentsInfo: $TSFixMe, orderId: $TSFixMe) {
  return this._trackPaymentEvent('payment_specialization_bulk_pay', userId, paymentsInfo, orderId);
};
Eventing.prototype.trackS12NSubscriptionPayment = function (
  userId: $TSFixMe,
  paymentsInfo: $TSFixMe,
  orderId: $TSFixMe
) {
  return this._trackPaymentEvent('payment_specialization_subscription', userId, paymentsInfo, orderId);
};
Eventing.prototype.trackS12NVCPayment = function (userId: $TSFixMe, paymentsInfo: $TSFixMe, orderId: $TSFixMe) {
  return this._trackPaymentEvent('payment_specialization', userId, paymentsInfo, orderId);
};
Eventing.prototype.trackVCPayment = function (userId: $TSFixMe, paymentsInfo: $TSFixMe, orderId: $TSFixMe) {
  return this._trackPaymentEvent('payment_non_specialization', userId, paymentsInfo, orderId);
};
Eventing.prototype.trackGuidedProjectPayment = function (userId: $TSFixMe, paymentsInfo: $TSFixMe, orderId: $TSFixMe) {
  return this._trackPaymentEvent('payment_guided_project', userId, paymentsInfo, orderId);
};
Eventing.prototype.trackCatalogSubscriptionPayment = function (
  userId: $TSFixMe,
  paymentsInfo: $TSFixMe,
  orderId: $TSFixMe
) {
  return this._trackPaymentEvent('payment_catalog_subscription', userId, paymentsInfo, orderId);
};
Eventing.prototype.trackCourseraPlusSubscriptionPayment = function (
  userId: $TSFixMe,
  paymentsInfo: $TSFixMe,
  orderId: $TSFixMe
) {
  return this._trackPaymentEvent('payment_coursera_plus_subscription', userId, paymentsInfo, orderId);
};

export default Eventing;
