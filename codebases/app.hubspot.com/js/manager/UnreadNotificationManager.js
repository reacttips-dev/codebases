'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import { getUnseenNotificationCount, markNotificationsAsSeen } from '../api/NotificationsApi';
import { RESET_COUNTER_EVENT } from '../constants/Events';
import { getNavNotificationsBellNode } from '../util/CounterUtil';
import * as FaviconManager from './FaviconManager';
import UnreadNotificationCountManager from './UnreadNotificationCountManager';

var UreadNotificationManager = /*#__PURE__*/function () {
  function UreadNotificationManager() {
    _classCallCheck(this, UreadNotificationManager);

    this.setup = this.setup.bind(this);
    this.resetCounter = this.resetCounter.bind(this);
  }

  _createClass(UreadNotificationManager, [{
    key: "resetCounter",
    value: function resetCounter(event) {
      if (event && event.preventDefault) {
        event.preventDefault();
      }

      UnreadNotificationCountManager.clearCounter();
      FaviconManager.resetFavicon(); // Only true when nav bell is clicked

      if (event) {
        markNotificationsAsSeen();
        this.crossTab.dispatchMessage({
          type: RESET_COUNTER_EVENT
        });
      }
    }
  }, {
    key: "setup",
    value: function setup(crossTab) {
      this.crossTab = crossTab;
      var navNotificationsBellNode = getNavNotificationsBellNode();

      if (navNotificationsBellNode) {
        navNotificationsBellNode.addEventListener('click', this.resetCounter);
        getUnseenNotificationCount().then(function (count) {
          if (count > 0) {
            UnreadNotificationCountManager.incrementUnreadNotificationsCount(count);
            FaviconManager.setFaviconDot();
          }
        }).catch(function (error) {
          throw error;
        });
      }
    }
  }]);

  return UreadNotificationManager;
}();

export default new UreadNotificationManager();