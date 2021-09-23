'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import http from 'hub-http/clients/apiClient';

var BroadcastInteractionManager = /*#__PURE__*/function () {
  function BroadcastInteractionManager(client) {
    _classCallCheck(this, BroadcastInteractionManager);

    this.client = client;
  }

  _createClass(BroadcastInteractionManager, [{
    key: "fetchAllInteractions",
    value: function fetchAllInteractions(broadcast, bustCache) {
      return Promise.all([this.client.fetchComments(broadcast, bustCache), this.client.fetchReactions(broadcast, bustCache)]).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            comments = _ref2[0],
            reactions = _ref2[1];

        return comments.concat(reactions);
      });
    }
  }, {
    key: "fetchComments",
    value: function fetchComments(broadcast, bustCache) {
      var query = bustCache ? {
        bustCache: bustCache
      } : {};
      return this.client.get("broadcast/v2/interactions/" + broadcast.getChannelSlug() + "/" + broadcast.getChannelId() + "/" + broadcast.foreignId + "/comments/fetch", {
        query: query
      });
    }
  }, {
    key: "fetchReactions",
    value: function fetchReactions(broadcast, bustCache) {
      var query = bustCache ? {
        bustCache: bustCache
      } : {};
      var id = broadcast.foreignIdForBoost || broadcast.foreignId;
      return this.client.get("broadcast/v2/interactions/" + broadcast.getChannelSlug() + "/" + broadcast.getChannelId() + "/" + id + "/reactions/fetch", {
        query: query
      });
    }
  }], [{
    key: "getInstance",
    value: function getInstance() {
      return new BroadcastInteractionManager(http);
    }
  }]);

  return BroadcastInteractionManager;
}();

export { BroadcastInteractionManager as default };