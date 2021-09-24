'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import http from 'hub-http/clients/apiClient';

var ScheduleManager = /*#__PURE__*/function () {
  function ScheduleManager(client) {
    _classCallCheck(this, ScheduleManager);

    this.client = client;
  }

  _createClass(ScheduleManager, [{
    key: "fetchSchedule",
    value: function fetchSchedule() {
      return this.client.get('broadcast/v1/suggested-time/schedule');
    }
  }, {
    key: "saveSchedule",
    value: function saveSchedule(data) {
      return this.client.post('broadcast/v1/suggested-time/schedule', {
        data: data
      });
    }
  }], [{
    key: "getInstance",
    value: function getInstance() {
      return new ScheduleManager(http);
    }
  }]);

  return ScheduleManager;
}();

export { ScheduleManager as default };