import Q from 'q';
import constants from 'bundles/ads-tracking/constants';
import AdsTracker from 'bundles/ads-tracking/tracker';
import Cookie from 'js/lib/cookie';
import Multitracker from 'js/app/multitrackerSingleton';
import memoize from 'js/lib/memoize';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'js/l... Remove this comment to see the full error message
import thirdParties from 'js/lib/thirdParties';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'js/l... Remove this comment to see the full error message
import timing from 'js/lib/timing';
import userJson from 'bundles/user-account/common/user';

const DATA_LAYER = constants.googleTagManager.dataLayerName;

function GoogleTagManager(...args: $TSFixMe[]) {
  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  AdsTracker.apply(this, args);
}

function trackEvent(eventName: $TSFixMe) {
  let multiTrackerEvent = 'adsTracker.googleTagManager.';
  multiTrackerEvent = multiTrackerEvent.concat(eventName);
  Multitracker.push([multiTrackerEvent]);
}

// @ts-ignore ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
GoogleTagManager.prototype = new AdsTracker();

GoogleTagManager.prototype.ensureLibLoaded = memoize(function () {
  const deferred = Q.defer();

  timing.time('googleTagManager');
  // @ts-ignore ts-migrate(7015) FIXME: Element implicitly has an 'any' type because index... Remove this comment to see the full error message
  window[DATA_LAYER] = window[DATA_LAYER] || [];
  // @ts-ignore ts-migrate(7015) FIXME: Element implicitly has an 'any' type because index... Remove this comment to see the full error message
  window[DATA_LAYER].push({
    'gtm.start': new Date().getTime(),
    sessionId: Cookie.get('__204u') || '1234',
    event: 'gtm.js',
  });
  thirdParties.loadScript(
    constants.googleTagManager.url,
    function () {
      timing.timeEnd('googleTagManager');
      // @ts-ignore ts-migrate(7015) FIXME: Element implicitly has an 'any' type because index... Remove this comment to see the full error message
      deferred.resolve(window[DATA_LAYER]);
    },
    function () {
      trackEvent('error');
    }
  );

  return deferred.promise;
});

GoogleTagManager.prototype.send = function (params: $TSFixMe) {
  return this.ensureLibLoaded().then(function (dataLayer: $TSFixMe) {
    return dataLayer.push(params);
  });
};

GoogleTagManager.prototype.prepareParams = function (eventName: $TSFixMe, additionalData: $TSFixMe) {
  return Object.assign(
    {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type '{} | UserDat... Remove this comment to see the full error message
      userId: (userJson && userJson.id) || '',
      event: eventName,
    },
    additionalData
  );
};

GoogleTagManager.prototype.trackSignup = function (userId: $TSFixMe) {
  trackEvent('signup');
  return this.track('Signup', { userId });
};

GoogleTagManager.prototype.trackEnroll = function (userId: $TSFixMe, courseId: $TSFixMe) {
  trackEvent('enroll');
  return this.track('Enroll', { userId, courseId });
};

GoogleTagManager.prototype.trackDegreeEOICompletion = function (
  degreeSlug: $TSFixMe,
  surveyResponseId: $TSFixMe,
  isQualified: $TSFixMe
) {
  trackEvent('degree_eoi_completion');

  const trackingInfo = {
    degreeSlug,
  };

  if (surveyResponseId) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'surveyResponseId' does not exist on type... Remove this comment to see the full error message
    trackingInfo.surveyResponseId = surveyResponseId;
  }

  if (isQualified) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'isQualified' does not exist on type '{ d... Remove this comment to see the full error message
    trackingInfo.isQualified = isQualified;
  }

  return this.track('DegreeEOICompletion', trackingInfo);
};

GoogleTagManager.prototype.trackDegreeApplyNow = function (degreeSlug: $TSFixMe) {
  trackEvent('degree_apply_now');

  const trackingInfo = {
    degreeSlug,
  };

  return this.track('DegreeApplyNow', trackingInfo);
};

GoogleTagManager.prototype.trackScheduleACall = function (degreeSlug: $TSFixMe) {
  trackEvent('schedule_a_call');

  const trackingInfo = {
    degreeSlug,
  };

  return this.track('ScheduleACall', trackingInfo);
};

GoogleTagManager.prototype.trackEnterpriseContractPayment = function (data: $TSFixMe) {
  trackEvent('wes_payment');
  return this.track('WESPayment', data);
};

GoogleTagManager.prototype._trackPaymentEvent = function (
  type: $TSFixMe,
  userId: $TSFixMe,
  paymentsInfoVal: $TSFixMe,
  orderId: $TSFixMe
) {
  const paymentsInfo = [].concat(paymentsInfoVal);
  const promises = paymentsInfo.map(
    ({ id, value, name, specializationId, currency, isFirstTimePayer, subscriptionCycle }) => {
      const specialization = {
        SpecializationId:
          specializationId ||
          ((type === 'specialization' || type === 'specializationSubscription') && id) ||
          'Non-Spec',
      };
      const course = type === 'course' ? { CourseId: id } : {};
      const subscription = subscriptionCycle ? { SubscriptionCycle: subscriptionCycle } : {};
      trackEvent('payment');

      return this.track(
        'Payment',
        Object.assign(
          {
            Value: parseInt(value || 0, 10),
            Type: type,
            Name: name,
            Currency: currency,
            FirstTimePayer: isFirstTimePayer,
          },
          specialization,
          course,
          subscription
        )
      );
    }
  );
  return Q.allSettled(promises);
};

GoogleTagManager.prototype.trackS12NBulkPayment = function (...args: $TSFixMe[]) {
  trackEvent('bulkpay');
  return this._trackPaymentEvent('specialization', ...args);
};

GoogleTagManager.prototype.trackS12NSubscriptionPayment = function (...args: $TSFixMe[]) {
  trackEvent('s12n_subscription_payment');
  return this._trackPaymentEvent('specializationSubscription', ...args);
};

GoogleTagManager.prototype.trackS12NVCPayment = function (...args: $TSFixMe[]) {
  trackEvent('s12n_course_purchase');
  return this._trackPaymentEvent('course', ...args);
};

GoogleTagManager.prototype.trackVCPayment = function (...args: $TSFixMe[]) {
  trackEvent('single_course_purchase');
  return this._trackPaymentEvent('course', ...args);
};

GoogleTagManager.prototype.trackGuidedProjectPayment = function (...args: $TSFixMe[]) {
  trackEvent('guided_project_purchase');
  return this._trackPaymentEvent('guidedProject', ...args);
};

GoogleTagManager.prototype.trackCatalogSubscriptionPayment = function (...args: $TSFixMe[]) {
  trackEvent('catalog_subscription_purchase');
  return this._trackPaymentEvent('catalogSubscription', ...args);
};

GoogleTagManager.prototype.trackCourseraPlusSubscriptionPayment = function (...args: $TSFixMe[]) {
  trackEvent('coursera_plus_subscription_purchase');
  return this._trackPaymentEvent('courseraPlusSubscription', ...args);
};

export default GoogleTagManager;
