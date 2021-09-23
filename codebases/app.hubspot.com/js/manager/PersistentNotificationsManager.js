'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import { setStorageItem } from 'notification-storage';
import * as PersistentNotificationsApi from '../api/PersistentNotificationsApi';
import { PERSISTENT_NOTIFICATIONS_HAS_BANNER_NOTIFICATIONS, PERSISTENT_NOTIFICATIONS_LAST_CHECKED } from '../constants/PersistentNotificationConstants';
import { PERSISTENT_STORAGE_KEY } from '../constants/StorageConstants';
import { bannerIframeExists, loadBannerIframe as _loadBannerIframe, shouldCheckForNotifications, isPromptNotification } from '../util/BannerUtil';
import { debug } from '../util/DebugUtil';
import { getPortalKey } from '../util/StorageUtil';
import ModalPrompts from 'prompts-lib/ModalPrompts';

var PersistentNotificationsManager = /*#__PURE__*/function () {
  function PersistentNotificationsManager() {
    _classCallCheck(this, PersistentNotificationsManager);
  }

  _createClass(PersistentNotificationsManager, null, [{
    key: "handleError",
    value: function handleError(error) {
      throw error;
    }
  }, {
    key: "loadBannerIframe",
    value: function loadBannerIframe() {
      if (bannerIframeExists()) {
        debug('Banner iframe already exists - not loading iframe');
        return;
      }

      debug('Loading banner iframe');

      _loadBannerIframe();
    }
  }, {
    key: "handleBannerNotifications",
    value: function handleBannerNotifications() {
      var notifications = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (notifications && notifications.length > 0) {
        /*
        prompts notifications are handled in a separate app from banner notifications
        to rendered them as interactive react components
        */
        var prompts = notifications.filter(function (value) {
          return isPromptNotification(value);
        });
        var hasPrompts = prompts.length > 0;
        var hasNotifications = notifications.length > prompts.length;

        if (hasPrompts) {
          ModalPrompts.add(prompts);
        }

        if (hasNotifications) {
          this.loadBannerIframe();
        }

        setStorageItem(PERSISTENT_STORAGE_KEY, getPortalKey(PERSISTENT_NOTIFICATIONS_HAS_BANNER_NOTIFICATIONS), true);
        return;
      }

      debug('User has no banner notifications - not loading iframe');
      setStorageItem(PERSISTENT_STORAGE_KEY, getPortalKey(PERSISTENT_NOTIFICATIONS_HAS_BANNER_NOTIFICATIONS));
    }
  }, {
    key: "checkForNotification",
    value: function checkForNotification() {
      var _this = this;

      PersistentNotificationsApi.getNotifications().then(function (_ref) {
        var banner = _ref.banner;

        _this.handleBannerNotifications(banner.notifications);
      }).catch(this.handleError);
    }
  }, {
    key: "markAs",
    value: function markAs(id, deliveryMethod, action) {
      return PersistentNotificationsApi.markAs(id, deliveryMethod, action).catch(this.handleError);
    }
  }, {
    key: "setup",
    value: function setup() {
      if (!shouldCheckForNotifications()) {
        debug('Persistent notifcations status cached - not checking for new notifications');
        return;
      }

      debug('Checking for persistent notifications');
      this.checkForNotification();
      setStorageItem(PERSISTENT_STORAGE_KEY, getPortalKey(PERSISTENT_NOTIFICATIONS_LAST_CHECKED), Date.now());
    }
  }]);

  return PersistentNotificationsManager;
}();

export { PersistentNotificationsManager as default };