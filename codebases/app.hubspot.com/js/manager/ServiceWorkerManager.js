'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import { NOTIFICATIONS_SERVICE_WORKER_SCOPE, NOTIFICATIONS_SERVICE_WORKER_URL } from '../constants/ServiceWorkerConstants';
import { debug } from '../util/DebugUtil';

var ServiceWorkerManager = /*#__PURE__*/function () {
  function ServiceWorkerManager() {
    _classCallCheck(this, ServiceWorkerManager);
  }

  _createClass(ServiceWorkerManager, [{
    key: "registerServiceWorker",
    value: function registerServiceWorker() {
      return navigator.serviceWorker.register(NOTIFICATIONS_SERVICE_WORKER_URL, {
        scope: NOTIFICATIONS_SERVICE_WORKER_SCOPE
      }).then(function () {
        debug('Notifications service worker registered');
      }).catch(function (error) {
        console.log(error);
        debug('Notifications service worker failed to register, error:', error);
      });
    }
  }]);

  return ServiceWorkerManager;
}();

export default new ServiceWorkerManager();