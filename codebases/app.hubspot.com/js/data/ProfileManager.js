'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import http from 'hub-http/clients/apiClient';
var MAX_SOCIAL_CONTACTS_LOOKUPS = 200;

var ProfileManager = /*#__PURE__*/function () {
  function ProfileManager(client) {
    _classCallCheck(this, ProfileManager);

    this.client = client;
  }

  _createClass(ProfileManager, [{
    key: "fetchTwitterProfile",
    value: function fetchTwitterProfile(userId) {
      return this.client.get("broadcast/v1/twitter/lookupId/" + userId);
    }
  }, {
    key: "fetchTwitterProfileByUsername",
    value: function fetchTwitterProfileByUsername(username) {
      return this.client.get("broadcast/v1/twitter/lookup/" + username);
    }
  }, {
    key: "fetchFacebookProfile",
    value: function fetchFacebookProfile(userId) {
      var query = {
        id: userId
      };
      return this.client.get('broadcast/v1/facebook/profiles', {
        query: query
      });
    }
  }, {
    key: "fetchSocialContactsBatch",
    value: function fetchSocialContactsBatch(users) {
      var data = {
        count: MAX_SOCIAL_CONTACTS_LOOKUPS,
        filterGroups: users.slice(0, MAX_SOCIAL_CONTACTS_LOOKUPS).map(function (user) {
          var filters = [{
            key: user.getType(),
            value: user.id
          }];

          if (user.name) {
            filters.push({
              key: 'NAME',
              value: user.name
            });
          }

          if (user.username) {
            filters.push({
              key: 'TWITTER_USERNAME',
              value: user.username
            });
          }

          return {
            filters: filters
          };
        })
      };
      return this.client.post('socialcontacts/v1/lookup', {
        data: data,
        timeout: 15000
      });
    }
  }], [{
    key: "getInstance",
    value: function getInstance() {
      return new ProfileManager(http);
    }
  }]);

  return ProfileManager;
}();

export { ProfileManager as default };