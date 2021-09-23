'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import http from 'hub-http/clients/apiClient';

var ReportManager = /*#__PURE__*/function () {
  function ReportManager(client) {
    _classCallCheck(this, ReportManager);

    this.client = client;
  }

  _createClass(ReportManager, [{
    key: "fetchSessionReport",
    value: function fetchSessionReport(channelId, broadcastGuid) {
      var query = {
        d1: channelId,
        f: broadcastGuid
      };
      return this.client.get("activities/v2/reports/social/total", {
        query: query
      });
    }
  }, {
    key: "fetchClicksReport",
    value: function fetchClicksReport(channelKey, broadcastGuid) {
      var query = {
        d1: channelKey,
        f: broadcastGuid
      };
      return this.client.get("activities/v2/reports/social-engagement/total", {
        query: query
      });
    }
  }, {
    key: "fetchNewContactsReport",
    value: function fetchNewContactsReport(channelId, broadcastGuid) {
      var query = {
        d1: channelId,
        f: broadcastGuid
      };
      return this.client.get("activities/v2/reports/social/people/contacts", {
        query: query
      });
    }
  }], [{
    key: "getInstance",
    value: function getInstance() {
      return new ReportManager(http);
    }
  }]);

  return ReportManager;
}();

export { ReportManager as default };