'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import http from 'hub-http/clients/apiClient';

var SourcesManager = /*#__PURE__*/function () {
  function SourcesManager(client) {
    _classCallCheck(this, SourcesManager);

    this.client = client;
  }

  _createClass(SourcesManager, [{
    key: "fetchSocialAssists",
    value: function fetchSocialAssists(broadcastGuid) {
      var lifecyclestage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'contacts';
      var query = {
        d1: broadcastGuid,
        forceLeviathan: true
      };
      return this.client.get("activities/v2/people/" + lifecyclestage + "/social-assists", {
        query: query
      });
    }
  }], [{
    key: "getInstance",
    value: function getInstance() {
      return new SourcesManager(http);
    }
  }]);

  return SourcesManager;
}();

export { SourcesManager as default };