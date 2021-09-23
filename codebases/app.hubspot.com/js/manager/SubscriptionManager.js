'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import { setStorageItem } from 'notification-storage';
import { addSubscription } from '../api/SubscriptionApi';
import { BROWSER_NOTIFICATION_LAST_SUBSCRIBED } from '../constants/BrowserNotificationConstants';
import { BROWSER_STORAGE_KEY } from '../constants/StorageConstants';
import { debug } from '../util/DebugUtil';
import { urlBase64ToUint8Array } from '../util/EncodingUtil';
import { getVapidKey } from '../util/KeysUtil';
import { hasGrantedNotificationsPermission, hasSubscribedToday } from '../util/BrowserNotificationUtil';

var SubscriptionManager = /*#__PURE__*/function () {
  function SubscriptionManager() {
    _classCallCheck(this, SubscriptionManager);
  }

  _createClass(SubscriptionManager, [{
    key: "subscribeToPushNotifications",

    /**
     * Subscriptions expire without warning at times. Resubscribe and store
     * the subscription on the backend if it has.
     */
    value: function subscribeToPushNotifications() {
      debug('Checking to see if the subscription has expired');

      if (!hasGrantedNotificationsPermission()) {
        return;
      }

      navigator.serviceWorker.ready.then(function (registration) {
        debug('Notifications service worker ready - getting subscription'); // Get the current subscription if it exists

        return registration.pushManager.getSubscription().then(function (subscription) {
          return {
            registration: registration,
            subscription: subscription
          };
        }).catch(function (error) {
          return debug('Notifications subscription: Could not get Subscription', error);
        });
      }).then(function (_ref) {
        var registration = _ref.registration,
            subscription = _ref.subscription;
        debug('Notifications subscription: ', subscription); // If no subscription or it is older than a day, subscribe again

        if (!subscription || !hasSubscribedToday()) {
          debug('Subscription has expired or does not exist, attempting to subscribe'); // If a subscription exists, unsubscribe from it

          var unsubPromise = new Promise(function (resolve) {
            if (subscription) {
              return subscription.unsubscribe().then(resolve()).catch(function (error) {
                debug('Notifications subscription: Error unsubscribing: ', error); // We want to resolve the promise anyway so that we can
                // continue to subscribe

                return resolve();
              });
            }

            return resolve();
          });
          return unsubPromise.then(function () {
            return registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(getVapidKey())
            }).catch(function (error) {
              return debug('Notifications subscription: Error subscribing: ', error);
            });
          });
        } // We have an actuve subscription and didn't need to subscribe so
        // return null so the next step does nothing


        return null;
      }).then(function (subscription) {
        if (subscription) {
          debug('Notifications subscription: ', subscription);
          setStorageItem(BROWSER_STORAGE_KEY, BROWSER_NOTIFICATION_LAST_SUBSCRIBED, Date.now());
          return addSubscription(subscription);
        }

        return null;
      }).catch(function (error) {
        console.log(error);
      });
    }
  }]);

  return SubscriptionManager;
}();

export default new SubscriptionManager();