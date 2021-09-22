import Q from 'q';
import constants from 'bundles/ads-tracking/constants';

function AdsTracker() {
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  this.logger = console;
}

AdsTracker.prototype.send = function (content: $TSFixMe) {
  return Q(content);
};

AdsTracker.prototype.prepareParams = function (params: $TSFixMe) {
  return params;
};

AdsTracker.prototype.track = function (...args: $TSFixMe[]) {
  const params = this.prepareParams(...args);
  if (constants.config.environment !== 'development') {
    // give the tracking call a max timeout
    return Q.timeout(this.send(params), constants.timeout);
  } else {
    return Q(params);
  }
};

AdsTracker.prototype.throwError = function (err: $TSFixMe) {
  if (constants.config.environment !== 'development') {
    this.logger.error(err);
  } else {
    throw new Error(err);
  }
};

/**
 * Track Signup Event
 * @param  {String} userId user id
 * @return {Promise}       Promise of the result of the tracking call
 */
AdsTracker.prototype.trackSignup = function (userId: $TSFixMe) {
  return Q();
};

/**
 * Track Enroll Event
 * @param  {String} userId user id
 * @return {Promise}       Promise of the result of the tracking call
 */
AdsTracker.prototype.trackEnroll = function (userId: $TSFixMe) {
  return Q();
};

/**
 * Track Degree EOI Completion
 * @param  {String} degreeSlug degree slug
 * @return {Promise}       Promise of the result of the tracking call
 */
AdsTracker.prototype.trackDegreeEOICompletion = function (degreeSlug: $TSFixMe) {
  return Q();
};

/**
 * Track Degree Apply Now
 * @param  {String} degreeSlug degree slug
 * @return {Promise}       Promise of the result of the tracking call
 */
AdsTracker.prototype.trackDegreeApplyNow = function (degreeSlug: $TSFixMe) {
  return Q();
};

/**
 * Track Schedule A Call clicks
 * @param  {String} degreeSlug degree slug
 * @return {Promise}       Promise of the result of the tracking call
 */
AdsTracker.prototype.trackScheduleACall = function (degreeSlug: $TSFixMe) {
  return Q();
};

/**
 * Track User Action Event
 * @param  {String} action type of action
 * @param  {String} userId user id
 * @return {Promise}       Promise of the result of the tracking call
 */
AdsTracker.prototype.trackAction = function (action: $TSFixMe, userId: $TSFixMe) {
  return Q();
};

/**
 * Track Specialization Bulk Payment
 * @param  {String} userId       user id
 * @param  {Object} paymentsInfo  Payment info containing the following fields:
 *                               `id` - unique id that represents the product
 *                               `value` - value paid in cents
 * @param  {String} orderId      Order id for the transaciton
 * @return {Promise}             Promise of the result of the tracking call
 */
AdsTracker.prototype.trackS12NBulkPayment = function (userId: $TSFixMe, paymentsInfo: $TSFixMe, orderId: $TSFixMe) {
  return Q();
};

/**
 * Track Specialization Subscription Payment
 * @param  {String} userId       user id
 * @param  {Object} paymentsInfo  Payment info containing the following fields:
 *                               `id` - unique id that represents the product
 *                               `value` - value paid in cents
 * @param  {String} orderId      Order id for the transaciton
 * @return {Promise}             Promise of the result of the tracking call
 */
AdsTracker.prototype.trackS12NSubscriptionPayment = function (
  userId: $TSFixMe,
  paymentsInfo: $TSFixMe,
  orderId: $TSFixMe
) {
  return Q();
};

/**
 * Track VC Payment for courses that are part of a specialization
 * @param  {String} userId       user id
 * @param  {Object} paymentsInfo  Payment info containing the following fields:
 *                               `id` - unique id that represents the product
 *                               `value` - value paid in cents
 * @param  {String} orderId      Order id for the transaciton
 * @return {Promise}             Promise of the result of the tracking call
 */
AdsTracker.prototype.trackS12NVCPayment = function (userId: $TSFixMe, paymentsInfo: $TSFixMe, orderId: $TSFixMe) {
  return Q();
};

/**
 * Track VC Payment for courses that are not part of a specialization
 * @param  {String} userId       user id
 * @param  {Object} paymentsInfo  Payment info containing the following fields:
 *                               `id` - unique id that represents the product
 *                               `value` - value paid in cents
 * @param  {String} orderId      Order id for the transaciton
 * @return {Promise}             Promise of the result of the tracking call
 */
AdsTracker.prototype.trackVCPayment = function (userId: $TSFixMe, paymentsInfo: $TSFixMe, orderId: $TSFixMe) {
  return Q();
};

/**
 * Track Enterprise contract payment
 * @param  {String} userId       user id
 * @param  {Object} paymentsInfo  Payment info containing the following fields:
 *                               `id` - unique id that represents the product
 *                               `value` - value paid in cents
 * @param  {String} orderId      Order id for the transaciton
 * @return {Promise}             Promise of the result of the tracking call
 */
AdsTracker.prototype.trackEnterpriseContractPayment = function (
  userId: $TSFixMe,
  paymentsInfo: $TSFixMe,
  orderId: $TSFixMe
) {
  return Q();
};

export default AdsTracker;
