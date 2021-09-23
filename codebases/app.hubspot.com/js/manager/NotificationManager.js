'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import { markAsDelivered } from '../api/NotificationsApi';
import { DELIVERY_METHOD_NAMES, DELIVERY_METHOD_PARAM } from '../constants/DeliveryMethods';
import { MESSAGE_CLOSED_EVENT } from '../constants/Events';
import { handleImportError } from '../util/ErrorUtil';
import { isFloating, isInApp, getAudioContext, playNativeOrMp3Sound } from '../util/NotificationUtil';
import { isCurrentPageShowing } from '../util/PageUtil';
import UserAttributesManager from './UserAttributesManager';
import BrowserNotificationManager from './BrowserNotificationManager';
import { shouldBlockNotification } from '../util/PreemptUtil';
import { addQueryParam } from '../util/UrlUtil';
import { PLAY_TEASE_SOUND } from '../constants/userAttributes';
import NotificationsUsageTracker from '../analytics/NotificationsUsageTracker';

var NotificationManager = /*#__PURE__*/function () {
  function NotificationManager() {
    var _this = this;

    _classCallCheck(this, NotificationManager);

    this._onVisibilityChanged = function () {
      if (!_this.canPlaySounds) {
        _this.getPlaySoundFunction({
          isDummySound: true
        })();
      }
    };

    // Only the master tab is allowed to show browser notifications or play sounds
    this.isMaster = false;
    this.canPlaySounds = false;
    this.onCloseListeners = [];

    this._setupVisibilityListeners();

    addEventListener('beforeunload', this._cleanupVisibilityListeners);
  } // Show the correct notification. Returns whether or not to play the sound


  _createClass(NotificationManager, [{
    key: "showNotification",
    value: function showNotification(notification) {
      var _this2 = this;

      return this._renderNotification(notification, this.isMaster).then(function (soundResult) {
        if (soundResult.playSound) {
          _this2._playSound(notification);
        }
      });
    }
  }, {
    key: "_renderNotification",
    value: function _renderNotification(notification, isMaster) {
      var shouldPlaySound = {
        playSound: false
      };

      if (isInApp(notification)) {
        if (isFloating(notification)) {
          return this._showFloating(notification, isMaster);
        } else {
          var hubspotActive = isCurrentPageShowing(); // return true for playSound if ny of the promises return true

          return Promise.all([this._showTease(notification, isMaster, hubspotActive), this._showBrowser(notification, isMaster, hubspotActive)]).then(function (resultsArray) {
            return resultsArray.reduce(function (acc, current) {
              return {
                playSound: acc.playSound || current.playSound
              };
            }, shouldPlaySound);
          });
        }
      }

      return Promise.resolve(shouldPlaySound);
    }
  }, {
    key: "_showFloating",
    value: function _showFloating(notification, isMaster) {
      var _this3 = this;

      if (notification.ctaProxyUrl) {
        notification.ctaProxyUrl = addQueryParam(notification.ctaProxyUrl, DELIVERY_METHOD_PARAM, DELIVERY_METHOD_NAMES.FLOATING);
      }

      if (isMaster) {
        markAsDelivered(notification, DELIVERY_METHOD_NAMES.FLOATING);
      }

      return this._importFloating().then(function (FloatingAlertUI) {
        var tracker = _this3._getNotificationsUsageTracker(notification, isMaster, DELIVERY_METHOD_NAMES.FLOATING);

        FloatingAlertUI.addNotificationToPage(notification, {
          onCloseListeners: _this3.onCloseListeners,
          tracker: tracker
        });
        return {
          playSound: false
        };
      }).catch(handleImportError);
    }
  }, {
    key: "_showTease",
    value: function _showTease(notification, isMaster, hubspotActive) {
      var _this4 = this;

      if (notification.ctaProxyUrl) {
        notification.ctaProxyUrl = addQueryParam(notification.ctaProxyUrl, DELIVERY_METHOD_PARAM, DELIVERY_METHOD_NAMES.TEASE);
      }

      if (isMaster) {
        markAsDelivered(notification, DELIVERY_METHOD_NAMES.TEASE);
      }

      return this._importTease().then(function (TeaseNotificationUI) {
        var tracker = _this4._getNotificationsUsageTracker(notification, isMaster, DELIVERY_METHOD_NAMES.TEASE);

        if (!shouldBlockNotification(notification)) {
          TeaseNotificationUI.init();
          TeaseNotificationUI.addNotificationToPage(notification, {
            onCloseListeners: _this4.onCloseListeners,
            tracker: tracker
          });

          if (isMaster && hubspotActive) {
            return {
              playSound: true
            };
          }
        }

        return {
          playSound: false
        };
      }).catch(handleImportError);
    }
  }, {
    key: "_showBrowser",
    value: function _showBrowser(notification, isMaster, hubspotActive) {
      // Regardless of Preempt predicates, show the browser notification if HubSpot
      // is not the active tab and this is the master
      if (!hubspotActive && isMaster) {
        BrowserNotificationManager.showBrowserNotification(notification);
        return Promise.resolve({
          playSound: true
        });
      }

      return Promise.resolve({
        playSound: false
      });
    }
  }, {
    key: "_importFloating",
    value: function _importFloating() {
      return import('../view/FloatingAlertUI'
      /* webpackChunkName: 'floating' */
      ).then(function (mod) {
        return mod.default;
      });
    }
  }, {
    key: "_importTease",
    value: function _importTease() {
      return import('../view/TeaseNotificationUI'
      /* webpackChunkName: 'tease' */
      ).then(function (mod) {
        return mod.default;
      });
    }
  }, {
    key: "_getNotificationsUsageTracker",
    value: function _getNotificationsUsageTracker(notification, isMaster, deliveryMethod) {
      return isMaster ? new NotificationsUsageTracker(notification, deliveryMethod) : undefined;
    }
  }, {
    key: "_playSound",
    value: function _playSound(notification) {
      return this.getPlaySoundFunction({
        notification: notification,
        isMaster: this.isMaster,
        userAttributesManager: new UserAttributesManager(notification.userId)
      })();
    } // This function could be passed to the tease UI and called when the
    // notification sound is to be played

  }, {
    key: "getPlaySoundFunction",
    value: function getPlaySoundFunction(opts) {
      var _this5 = this;

      var notification = opts.notification,
          isMaster = opts.isMaster,
          userAttributesManager = opts.userAttributesManager,
          _opts$isDummySound = opts.isDummySound,
          isDummySound = _opts$isDummySound === void 0 ? false : _opts$isDummySound;
      var p = Promise.resolve(false);

      if (isDummySound) {
        p = Promise.resolve(true);
      } else {
        if (isMaster) {
          p = userAttributesManager.getAttributeValue(PLAY_TEASE_SOUND).then(function (attributeValue) {
            return typeof attributeValue === 'undefined' || attributeValue;
          });
        }
      }

      return function () {
        return p.then(function (soundsAllowed) {
          if (soundsAllowed) {
            return playNativeOrMp3Sound(getAudioContext(), isDummySound);
          }

          return Promise.resolve();
        }).then(function () {
          // Playing the sound succeeded so set the value to true
          _this5.setCanPlaySounds(true);
        }).catch(function () {
          if (notification) {
            console.error('Could not play audio');
          }
        });
      };
    }
  }, {
    key: "onClose",
    value: function onClose(listener) {
      this.onCloseListeners.push(listener);
    }
  }, {
    key: "notificationClosed",
    value: function notificationClosed(id) {
      // Emit an event specific to this notification
      dispatchEvent(new CustomEvent(MESSAGE_CLOSED_EVENT + "-" + id, {
        detail: {
          id: id,
          type: MESSAGE_CLOSED_EVENT
        }
      }));
    }
  }, {
    key: "setIsMaster",
    value: function setIsMaster(value) {
      this.isMaster = value;
    }
  }, {
    key: "getCanPlaySounds",
    value: function getCanPlaySounds() {
      return this.canPlaySounds;
    }
  }, {
    key: "setCanPlaySounds",
    value: function setCanPlaySounds(value) {
      this.canPlaySounds = value;
    } // Every time the tab visiblility changes, check if the tab can play sounds
    // and, if not, attempt to play a dummy sound. So if this becomes master it
    // will be able to play notification sounds

  }, {
    key: "_setupVisibilityListeners",
    value: function _setupVisibilityListeners() {
      addEventListener('visibilitychange', this._onVisibilityChanged);
    }
  }, {
    key: "_cleanupVisibilityListeners",
    value: function _cleanupVisibilityListeners() {
      removeEventListener('visibilitychange', this._onVisibilityChanged);
    }
  }]);

  return NotificationManager;
}();

export default new NotificationManager();