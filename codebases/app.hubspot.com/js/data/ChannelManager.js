'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import http from 'hub-http/clients/apiClient';
import { quickFetchResponse } from '../lib/quickFetch';

var ChannelManager = /*#__PURE__*/function () {
  function ChannelManager(client) {
    _classCallCheck(this, ChannelManager);

    this.client = client;
  }

  _createClass(ChannelManager, [{
    key: "fetchAccountsWithChannels",
    value: function fetchAccountsWithChannels() {
      var _this = this;

      var query = {
        allChannels: true
      };

      var makeApiCall = function makeApiCall() {
        return _this.client.get("broadcast/v2/accounts/with-channels", {
          query: query
        });
      };

      var qfResp = quickFetchResponse('accounts-with-channels');
      return qfResp ? qfResp.catch(makeApiCall) : makeApiCall();
    }
  }, {
    key: "deleteChannel",
    value: function deleteChannel(channelKey) {
      return this.client.delete("broadcast/v2/channels/" + channelKey);
    }
  }, {
    key: "savePublishAnywhere",
    value: function savePublishAnywhere(channelId, attrs) {
      return this.client.put("broadcast/v2/twitter/" + channelId + "/publish-anywhere", {
        data: attrs
      });
    }
  }, {
    key: "saveChannelByKey",
    value: function saveChannelByKey(channelKey, attrs, options) {
      var query = Object.assign({}, options);

      if (typeof attrs.shared === 'boolean') {
        query.shared = attrs.shared;
      }

      return this.client.put("broadcast/v2/channels/" + channelKey + "/settings", {
        query: query
      });
    }
  }, {
    key: "saveBlogAutoPublish",
    value: function saveBlogAutoPublish(channelKey, data) {
      return this.client.put("broadcast/v1/blog-publish/" + channelKey + "/settings", {
        data: data
      });
    }
  }], [{
    key: "getInstance",
    value: function getInstance() {
      return new ChannelManager(http);
    }
  }]);

  return ChannelManager;
}();

export { ChannelManager as default };