'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import { setStorageItem } from 'notification-storage';
import SubscriptionManager from '../manager/SubscriptionManager';
import ServiceWorkerManager from '../manager/ServiceWorkerManager';
import PrePermissionPopup, { FADE_IN_CLASS } from '../components/PrePermissionPopup';
import { GRANTED, DENIED } from '../constants/NotificationPermissionContants';
import { BROWSER_STORAGE_KEY } from '../constants/StorageConstants';
import { BROWSER_NOTIFICATION_PRE_PERMISSION_POPUP_ACCEPT_TIME, BROWSER_NOTIFICATION_PRE_PERMISSION_POPUP_DISMISS_TIME } from '../constants/BrowserNotificationConstants';
import Overlay from '../components/Overlay';
import { render } from '../util/ComponentsUtil';
import I18n from 'I18n';
import BrowserNotificationsUsage from '../analytics/BrowserNotificationsUsage';
import { canReceiveBrowserNotifications, shouldShowPrePermissionPopup } from '../util/BrowserNotificationUtil';

var PrePermissionPopupManager = /*#__PURE__*/function () {
  function PrePermissionPopupManager() {
    _classCallCheck(this, PrePermissionPopupManager);

    this.overlay = render(Overlay);
    this.parent = window.top.document.body;
    this.popup = null;
  }

  _createClass(PrePermissionPopupManager, [{
    key: "addOverlay",
    value: function addOverlay() {
      this.parent.appendChild(this.overlay);
    }
  }, {
    key: "removeOverlay",
    value: function removeOverlay() {
      this.parent.removeChild(this.overlay);
    }
  }, {
    key: "renderPopup",
    value: function renderPopup(onContinueClick, onMaybeLaterClick) {
      this.popup = render(PrePermissionPopup, {
        onContinueClick: onContinueClick,
        onMaybeLaterClick: onMaybeLaterClick
      }); // Add it to the top document for iframed cases

      window.top.document.body.appendChild(this.popup);
      /* eslint-disable */
      // Need to call `clientHeight` for a page repaint

      this.popup.clientHeight;
      /* eslint-enable */

      this.popup.classList.add(FADE_IN_CLASS);
    }
  }, {
    key: "show",
    value: function show() {
      var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (force || canReceiveBrowserNotifications() && shouldShowPrePermissionPopup()) {
        this.renderPrePermissionPopup();
      }
    }
  }, {
    key: "remove",
    value: function remove() {
      this.parent.removeChild(this.overlay);
      this.parent.removeChild(this.popup);
    }
  }, {
    key: "renderPrePermissionPopup",
    value: function renderPrePermissionPopup() {
      var _this = this;

      I18n.Info.then(function () {
        BrowserNotificationsUsage.trackPrePermissionPopupShown();

        _this.addOverlay();

        _this.renderPopup(function () {
          setStorageItem(BROWSER_STORAGE_KEY, BROWSER_NOTIFICATION_PRE_PERMISSION_POPUP_ACCEPT_TIME, Date.now());

          _this.requestNotificationPermission(function () {
            ServiceWorkerManager.registerServiceWorker();
            SubscriptionManager.subscribeToPushNotifications();
            BrowserNotificationsUsage.trackNativeRequestAllowClicked();
          }, function () {
            BrowserNotificationsUsage.trackNativeRequestDenyClicked();
          });

          BrowserNotificationsUsage.trackPrePermissionContinueClicked();
        }, function () {
          setStorageItem(BROWSER_STORAGE_KEY, BROWSER_NOTIFICATION_PRE_PERMISSION_POPUP_DISMISS_TIME, Date.now());

          _this.removeOverlay();

          BrowserNotificationsUsage.trackPrePermissionMaybeLaterClicked();
        });
      });
    }
  }, {
    key: "requestNotificationPermission",
    value: function requestNotificationPermission(onGrant, onDeny) {
      var _this2 = this;

      BrowserNotificationsUsage.trackNativeRequestPermissionShown();
      Notification.requestPermission(function (permission) {
        if (permission === GRANTED) {
          onGrant();
        } else if (permission === DENIED) {
          onDeny();
        }

        _this2.removeOverlay();
      });
    }
  }]);

  return PrePermissionPopupManager;
}();

export default new PrePermissionPopupManager();