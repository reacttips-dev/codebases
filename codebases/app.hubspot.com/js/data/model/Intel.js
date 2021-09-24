'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { List, Map as ImmutableMap, Record } from 'immutable';
import { identity } from 'underscore';
import FeedUser from './FeedUser';
import Contact from './Contact';
import { ACCOUNT_TYPES } from '../../lib/constants';
var DEFAULTS = {
  networks: ImmutableMap()
};
var INTEL_KEY_TO_NETWORK = {
  TWITTER_ID: ACCOUNT_TYPES.twitter,
  FACEBOOK_ID: ACCOUNT_TYPES.facebook,
  LINKEDIN_ID: ACCOUNT_TYPES.linkedin
}; // maps to a socialIntel user

var Intel = /*#__PURE__*/function (_Record) {
  _inherits(Intel, _Record);

  function Intel() {
    _classCallCheck(this, Intel);

    return _possibleConstructorReturn(this, _getPrototypeOf(Intel).apply(this, arguments));
  }

  _createClass(Intel, [{
    key: "getNetwork",
    value: function getNetwork(network) {
      return this.networks.get(network) || ImmutableMap();
    }
  }], [{
    key: "parseFrom",
    value: function parseFrom(data) {
      var networks = ImmutableMap();
      Object.keys(data).forEach(function (intelKey) {
        var users = data[intelKey];
        var network = INTEL_KEY_TO_NETWORK[intelKey];
        networks = networks.set(network, ImmutableMap(Object.keys(users).map(function (id) {
          var userData = users[id];

          if (Object.keys(userData.social.profile).length === 0) {
            return null;
          }

          return [id, FeedUser.parseFromIntelBatch(userData, network)];
        }).filter(identity)));
      });
      return new Intel({
        networks: networks
      });
    }
  }, {
    key: "parseFromSocialContactsBatch",
    value: function parseFromSocialContactsBatch(data) {
      var users = data.filter(function (match) {
        return match.exactMatches.length || match.possibleMatches.length;
      }).map(function (match) {
        var _FeedUser;

        var idLookup = match.filterGroup.filters.find(function (f) {
          return f.key.endsWith('_ID');
        });

        if (!idLookup) {
          idLookup = match.filterGroup.filters.find(function (f) {
            return f.key === 'EMAIL';
          });
        }

        var networkId = idLookup.value;
        var network = idLookup.key.replace('_ID', '').toLocaleLowerCase();
        var contact = match.exactMatches.length > 0 ? Contact.createFrom(match.exactMatches[0]) : null;
        var possibleContacts = List(match.possibleMatches.filter(function (pm) {
          return pm.matchScore > 20;
        }).map(function (pm) {
          return Contact.createFrom(pm.contact);
        }));
        return new FeedUser((_FeedUser = {
          network: network
        }, _defineProperty(_FeedUser, network + "_details", ImmutableMap({
          id: networkId
        })), _defineProperty(_FeedUser, "contact", contact), _defineProperty(_FeedUser, "possibleContacts", possibleContacts), _FeedUser));
      });
      var networks = List(users).groupBy(function (fu) {
        return fu.network;
      }).map(function (_users) {
        return ImmutableMap(_users.map(function (u) {
          return [u.getUserId(), u];
        }));
      });
      return new Intel({
        networks: networks
      });
    }
  }]);

  return Intel;
}(Record(DEFAULTS));

export { Intel as default };