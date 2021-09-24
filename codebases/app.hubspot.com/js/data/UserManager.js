'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import { isArray, isObject } from 'underscore';
import { Iterable } from 'immutable';
import http from 'hub-http/clients/apiClient';
import PortalIdParser from 'PortalIdParser';
import { API_USER_ATTRIBUTES_BASE_URL, USER_ATTRIBUTES_TO_FETCH } from '../lib/constants';
import { DEFAULTS as HUB_SETTINGS_TO_FETCH } from './model/HubSettings';
import { quickFetchResponse } from '../lib/quickFetch';

var UserManager = /*#__PURE__*/function () {
  function UserManager(client) {
    _classCallCheck(this, UserManager);

    this.client = client;
  }

  _createClass(UserManager, [{
    key: "fetchPortalUsers",
    value: function fetchPortalUsers() {
      return this.client.get('users/v2/app/hub-users');
    }
  }, {
    key: "fetchAttributes",
    value: function fetchAttributes() {
      var _this = this;

      var makeApiCall = function makeApiCall() {
        return _this.client.put(API_USER_ATTRIBUTES_BASE_URL + "/bulk-get", {
          data: {
            keys: USER_ATTRIBUTES_TO_FETCH
          }
        });
      };

      var qfResp = quickFetchResponse('user-attributes');
      return qfResp ? qfResp.catch(makeApiCall) : makeApiCall();
    }
  }, {
    key: "deleteAttribute",
    value: function deleteAttribute(userId, key) {
      if (!userId) {
        throw new Error('userId is required');
      }

      return this.client.delete(API_USER_ATTRIBUTES_BASE_URL + "/" + userId + "/" + key);
    }
  }, {
    key: "saveAttribute",
    value: function saveAttribute(_ref) {
      var key = _ref.key,
          value = _ref.value;
      return this.client.post("" + API_USER_ATTRIBUTES_BASE_URL, {
        data: {
          key: key,
          value: value
        }
      });
    }
  }, {
    key: "fetchEmailSettings",
    value: function fetchEmailSettings(userId) {
      if (!userId) {
        throw new Error('userId is required');
      }

      var query = {
        userId: userId
      };
      return this.client.get('socialmonitoring/v1/emailsettings', {
        query: query
      });
    }
  }, {
    key: "saveEmailSettings",
    value: function saveEmailSettings(data) {
      if (!data.userId) {
        throw new Error('userId is required');
      }

      var query = {
        userId: data.userId
      };

      if (data.id) {
        return this.client.put("socialmonitoring/v1/emailsettings/" + data.id, {
          query: query,
          data: data
        });
      }

      return this.client.post('socialmonitoring/v1/emailsettings', {
        query: query,
        data: data
      });
    }
  }, {
    key: "fetchHubSettings",
    value: function fetchHubSettings() {
      var _this2 = this;

      var keysToGet = Object.keys(HUB_SETTINGS_TO_FETCH).filter(function (key) {
        return key !== 'loaded';
      });
      var keysToGetString = keysToGet.join('&keys=');

      var makeApiCall = function makeApiCall() {
        return _this2.client.get("hubs-settings/v1/settings?keys=" + keysToGetString);
      };

      var qfResp = quickFetchResponse('hub-settings');
      return qfResp ? qfResp.catch(makeApiCall) : makeApiCall();
    }
  }, {
    key: "saveHubSetting",
    value: function saveHubSetting(key, value) {
      var data = {
        key: key,
        value: isArray(value) || isObject(value) || Iterable.isIterable(value) ? JSON.stringify(value) : value,
        hubId: PortalIdParser.get(),
        internal: true
      };
      return this.client.post('hubs-settings/v1/settings', {
        data: data
      });
    }
  }], [{
    key: "getInstance",
    value: function getInstance() {
      return new UserManager(http);
    }
  }]);

  return UserManager;
}();

export { UserManager as default };