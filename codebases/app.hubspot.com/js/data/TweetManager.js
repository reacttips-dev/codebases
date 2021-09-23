'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import http from 'hub-http/clients/apiClient';

var TweetManager = /*#__PURE__*/function () {
  function TweetManager(client) {
    _classCallCheck(this, TweetManager);

    this.client = client;
  }

  _createClass(TweetManager, [{
    key: "bulkStatusLookup",
    value: function bulkStatusLookup(statusIds) {
      var query = {
        id: statusIds
      };
      return this.client.get("broadcast/v2/twitter/bulk-status-lookup", {
        query: query
      });
    }
  }], [{
    key: "getInstance",
    value: function getInstance() {
      return new TweetManager(http);
    }
  }]);

  return TweetManager;
}();

export { TweetManager as default };