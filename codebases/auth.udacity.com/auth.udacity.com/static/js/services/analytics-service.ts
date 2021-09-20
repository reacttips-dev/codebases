import LocalizationService, { MANAGED_REGIONS } from './localization-service';

// Wrapper around window to define the properties we expect
interface UWindow extends Window {
  analytics: {
    track: Function;
    identify: Function;
    [key: string]: Function;
  };
  dataLayer: { event: string }[];
}

declare let window: UWindow;

/**
 * Got this helper function from ureact-analytics:
 * https://github.com/udacity/ureact-analytics/blob/c919362c0c0277c7d80c1ca65bc27d34798581a8/src/index.js#L44
 *
 * This promisifies the segment analytics call, which allows using promises instead of the `callback`
 * function (while still supporting the `callback` argument).
 */
const CALL_TIMEOUT = 300;
function callAndPromisifySegmentFn(
  segmentFnName: string,
  arg0: string | object,
  arg1: string | object,
  arg2?: string | object,
  callback?: Function
): Promise<void> {
  return new Promise<void>((resolve) => {
    if (!window.analytics) {
      const errorMessage = `Missing window.analytics, cannot call "${segmentFnName}"`;
      console.error(errorMessage);
      resolve();
      return;
    }

    let isCompleted = false;
    function complete(): void {
      if (!isCompleted) {
        isCompleted = true;
        if (callback instanceof Function) {
          callback(arguments);
        }
        resolve();
      }
    }

    window.analytics[segmentFnName](arg0, arg1, arg2, complete);

    // In case the analytics callback is never called (such as when a service like Ghostery stubs
    // out the entire `window.analytics` object to a noop), we'll guarantee to complete after a short
    // timeout
    setTimeout(complete, CALL_TIMEOUT);
  });
}

/**
 * Analytics Service
 * Expects window.analytics to be defined by the parent application.
 */
export default {
  identify: (id: string, email: string): Promise<void> => {
    return new Promise((resolve) => {
      return callAndPromisifySegmentFn('identify', id, { email }, '', () => {
        resolve();
      });
    });
  },

  track: (eventName: string, options: object): Promise<void> => {
    const baseOptions = {
      geolocation: LocalizationService.getGeoLocation()
    };

    return callAndPromisifySegmentFn('track', eventName, {
      ...baseOptions,
      ...options
    });
  },

  trackEmailLeadGenEvent: (email: string): Promise<void> => {
    const referredByWWW = document.referrer.match(
      /^https?:\/\/www.udacity.com/
    );
    const countryCode = LocalizationService.getGeoLocation();
    const isManagedRegion = MANAGED_REGIONS.includes(countryCode);
    const isHqUser = referredByWWW || !isManagedRegion;
    const fireGTM = isHqUser;
    const location = isHqUser ? 'HQ' : 'Intl';

    if (fireGTM) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'emailSubmitted' });
    }

    return callAndPromisifySegmentFn(
      'track',
      'Marketing Qualified Lead Form Submitted',
      {
        category: 'Lead Generation',
        label: `Lead Generation - ${location} - Account Signup (AuthComponent)`,
        formId: 'Account Signup (AuthComponent)',
        geolocation: countryCode,
        email,
        gtm_activated: fireGTM
      }
    );
  }
};
