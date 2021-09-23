'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import http from 'hub-http/clients/apiClient';
var BASE_PATH = 'broadcast/v1/accounts';
var BASE_PATH_V2 = 'broadcast/v2/accounts';
var TIMEOUT = 180 * 1000;

var AccountManager = /*#__PURE__*/function () {
  function AccountManager(client) {
    _classCallCheck(this, AccountManager);

    this.client = client;
  }

  _createClass(AccountManager, [{
    key: "createAccount",
    value: function createAccount(network) {
      var data = {
        type: network
      };
      return this.client.post(BASE_PATH_V2, {
        data: data
      }).then(function (resp) {
        resp.accountSlug = resp.accountSlug || resp.accountType.toLowerCase();
        return resp;
      });
    }
  }, {
    key: "connectAccount",
    value: function connectAccount(network, accountUserId) {
      var data = {
        type: network
      };
      var query = {
        accountUserId: accountUserId
      };
      return this.client.post(BASE_PATH_V2 + "/connect", {
        data: data,
        query: query,
        timeout: TIMEOUT
      });
    }
  }, {
    key: "exchangeAuthCode",
    value: function exchangeAuthCode(account) {
      return this.client.put(BASE_PATH_V2 + "/exchange-authorization-code", {
        data: account,
        query: account.query,
        timeout: TIMEOUT
      });
    }
  }, {
    key: "activateAccount",
    value: function activateAccount(account, channelKeys) {
      return this.client.post(BASE_PATH_V2 + "/activate", {
        data: {
          account: account,
          channelKeys: channelKeys
        },
        timeout: TIMEOUT
      });
    }
  }, {
    key: "deleteAccount",
    value: function deleteAccount(accountGuid) {
      return this.client.delete(BASE_PATH + "/" + accountGuid);
    }
  }], [{
    key: "getInstance",
    value: function getInstance() {
      return new AccountManager(http);
    }
  }]);

  return AccountManager;
}();

export { AccountManager as default };