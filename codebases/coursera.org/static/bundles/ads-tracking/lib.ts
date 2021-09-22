import Q from 'q';
import _ from 'lodash';
import GoogleTagManager from 'bundles/ads-tracking/GoogleTagManager';
import Eventing from 'bundles/ads-tracking/eventing';
import requestCountryCode from 'bundles/phoenix/template/models/requestCountryCode';
import shouldLoadAdTracking from 'bundles/ads-tracking/shouldLoadAdTracking';
import logger from 'js/app/loggerSingleton';

const isRestrictedPath =
  typeof window !== 'undefined' && ['/reset/confirm'].some((a) => window.location.pathname.includes(a));

const shouldLoadSoftTracking = requestCountryCode !== 'CN' && !isRestrictedPath;

const getTrackers = () => {
  if (shouldLoadAdTracking()) {
    // @ts-ignore ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    return [new GoogleTagManager(), new Eventing()];
  } else if (shouldLoadSoftTracking) {
    // @ts-ignore ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    return [new Eventing()];
  } else {
    return [];
  }
};
const trackers = getTrackers();

const trackEvent = function (event: string) {
  return function (...args: $TSFixMe[]) {
    const trackingCalls = _.map(trackers, function (tracker) {
      if (!tracker[event]) {
        logger.error(`${tracker.constructor.name} does not support tracking event ${event}`);
        return Q();
      }

      return tracker[event](...args);
    });
    return Q.allSettled(trackingCalls);
  };
};

export { trackers };
export const trackSignup = trackEvent('trackSignup');
export const trackEnroll = trackEvent('trackEnroll');
export const trackDegreeEOICompletion = trackEvent('trackDegreeEOICompletion');
export const trackDegreeApplyNow = trackEvent('trackDegreeApplyNow');
export const trackScheduleACall = trackEvent('trackScheduleACall');
export const trackAction = trackEvent('trackAction');
export const trackS12NBulkPayment = trackEvent('trackS12NBulkPayment');
export const trackS12NSubscriptionPayment = trackEvent('trackS12NSubscriptionPayment');
export const trackS12NVCPayment = trackEvent('trackS12NVCPayment');
export const trackVCPayment = trackEvent('trackVCPayment');
export const trackGuidedProjectPayment = trackEvent('trackGuidedProjectPayment');
export const trackCatalogSubscriptionPayment = trackEvent('trackCatalogSubscriptionPayment');
export const trackEnterpriseContractPayment = trackEvent('trackEnterpriseContractPayment');
export const trackCourseraPlusSubscriptionPayment = trackEvent('trackCourseraPlusSubscriptionPayment');

const adsTracker = {
  trackers,
  trackSignup,
  trackEnroll,
  trackDegreeEOICompletion,
  trackDegreeApplyNow,
  trackScheduleACall,
  trackAction,
  trackS12NBulkPayment,
  trackS12NSubscriptionPayment,
  trackS12NVCPayment,
  trackVCPayment,
  trackGuidedProjectPayment,
  trackCatalogSubscriptionPayment,
  trackEnterpriseContractPayment,
  trackCourseraPlusSubscriptionPayment,
};

export default adsTracker;
