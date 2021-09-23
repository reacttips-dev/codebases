'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import PrePermissionPopupManager from './PrePermissionPopupManager';
import UnreadNotificationManager from './UnreadNotificationManager';
import { TYPE_PREPERMISSION_POPUP_SHOW, TYPE_PREPERMISSION_POPUP_REMOVE, NOTIFICATION_RESET_BELL_COUNTER } from '../constants/PostMessageConstants';

var PostMessageManager = /*#__PURE__*/function () {
  function PostMessageManager() {
    _classCallCheck(this, PostMessageManager);
  }

  _createClass(PostMessageManager, [{
    key: "init",
    value: function init() {
      window.addEventListener('message', this.receiveMessage.bind(this));
    }
  }, {
    key: "receiveMessage",
    value: function receiveMessage(event) {
      // Only accept messages from hubspot urls
      if (!event.origin.match(/\.hubspot(qa)?\.com/)) {
        return;
      }

      var message;

      try {
        message = JSON.parse(event.data);
      } catch (e) {
        if (console) {
          console.log('Notifications received an unparsable postMessage: ', e, event);
        }

        return;
      }

      if (!message.name) {
        console.log('Notifications received a postMessage with no name: ', event);
        return;
      }

      switch (message.name) {
        case TYPE_PREPERMISSION_POPUP_SHOW:
          {
            var force = !!(message.force && message.force === true);
            PrePermissionPopupManager.show(force);
            break;
          }

        case TYPE_PREPERMISSION_POPUP_REMOVE:
          {
            PrePermissionPopupManager.remove();
            break;
          }

        case NOTIFICATION_RESET_BELL_COUNTER:
          {
            UnreadNotificationManager.resetCounter(true);
            break;
          }

        default:
          break;
      }
    }
  }]);

  return PostMessageManager;
}();

export default new PostMessageManager();