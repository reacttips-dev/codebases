'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { List, Record } from 'immutable';
import { SOCIAL_USER_LOOKUP_TYPES, SOCIAL_CONTACTS_NETWORKS } from '../../lib/constants';
var DEFAULTS = {
  network: null,
  id: null,
  name: null,
  username: null
};

var UserLookup = /*#__PURE__*/function (_Record) {
  _inherits(UserLookup, _Record);

  function UserLookup() {
    _classCallCheck(this, UserLookup);

    return _possibleConstructorReturn(this, _getPrototypeOf(UserLookup).apply(this, arguments));
  }

  _createClass(UserLookup, [{
    key: "getType",
    value: function getType() {
      return this.network === SOCIAL_USER_LOOKUP_TYPES.email ? 'EMAIL' : this.network.toUpperCase() + "_ID";
    }
  }], [{
    key: "createForInteractions",
    value: function createForInteractions(interactions) {
      return interactions.filter(function (i) {
        return SOCIAL_CONTACTS_NETWORKS.includes(i.socialNetwork);
      }).map(function (i) {
        return UserLookup.fromInteraction(i);
      }).filter(function (i) {
        return i.id || i.username;
      }).toOrderedSet();
    }
  }, {
    key: "createForFeedItems",
    value: function createForFeedItems(feedItems) {
      return feedItems.filter(function (i) {
        return SOCIAL_CONTACTS_NETWORKS.includes(i.network);
      }).map(function (i) {
        return i.getUserLookups();
      }).reduce(function (acc, _users) {
        return acc.concat(_users);
      }, List()).filter(function (i) {
        return i.id || i.username;
      }).toOrderedSet();
    }
  }, {
    key: "createForAssists",
    value: function createForAssists(assists) {
      return assists.map(function (a) {
        return new UserLookup({
          id: a.email,
          name: a.getName(),
          network: SOCIAL_USER_LOOKUP_TYPES.email
        });
      }).filter(function (i) {
        return i.id || i.username;
      }).toOrderedSet();
    }
  }, {
    key: "fromInteraction",
    value: function fromInteraction(interaction) {
      return new UserLookup({
        id: interaction.getUserId(),
        network: interaction.socialNetwork,
        username: interaction.getUsername(),
        name: interaction.getFullName()
      });
    }
  }]);

  return UserLookup;
}(Record(DEFAULTS));

export { UserLookup as default };