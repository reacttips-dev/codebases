'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { List, Map as ImmutableMap, Record, Set as ImmutableSet } from 'immutable';
import { ACCOUNT_TYPES, EXPIRE_SOON_DAYS, getAccountDisplayName, LINKEDIN_EXPIRE_SOON_DAYS } from '../../lib/constants';
import I18n from 'I18n'; // Each of these keys should correspond to a key that
// originates from the "/connect" API endpoint
// (AccountManager.connectAccount)
// This is necessary for the "/activate" endpoint to work properly
// (AccountManager.activateAccount)

var DEFAULTS = {
  accountGuid: null,
  accountScopes: null,
  accountSlug: null,
  accountType: null,
  avatarUrl: null,
  authenticated: null,
  createdAt: null,
  createdBy: null,
  dataMap: ImmutableMap(),
  deleted: null,
  expired: null,
  expiresAt: null,
  failureReason: null,
  hidden: null,
  missingScopes: ImmutableSet(),
  name: null,
  pageLocation: ImmutableMap(),
  portalId: null,
  requiresOneOffPermissionReconnect: null,
  serviceId: null,
  updatedAt: null,
  // does not come from backend, attached by UI to simplify model
  user: null
};

var Account = /*#__PURE__*/function (_Record) {
  _inherits(Account, _Record);

  function Account() {
    _classCallCheck(this, Account);

    return _possibleConstructorReturn(this, _getPrototypeOf(Account).apply(this, arguments));
  }

  _createClass(Account, [{
    key: "getDisplayName",
    value: function getDisplayName() {
      return getAccountDisplayName(this.accountSlug);
    }
  }, {
    key: "hasYoutubePosts",
    value: function hasYoutubePosts() {
      var privacyStatus = this.dataMap.get('privacyStatus');
      return parseInt(this.dataMap.get('postCount'), 10) > 0 && privacyStatus !== 'private';
    }
  }, {
    key: "hasReportingData",
    value: function hasReportingData() {
      if (this.accountSlug === ACCOUNT_TYPES.youtube) {
        return this.hasYoutubePosts();
      }

      return true;
    }
  }, {
    key: "getWillExpireSoon",
    value: function getWillExpireSoon() {
      var expireSoon = this.accountSlug === ACCOUNT_TYPES.linkedin ? LINKEDIN_EXPIRE_SOON_DAYS : EXPIRE_SOON_DAYS;
      return !this.expired && I18n.moment(this.expiresAt).diff(I18n.moment(), 'days') < expireSoon;
    }
  }], [{
    key: "createFrom",
    value: function createFrom(attrs) {
      if (attrs instanceof Account) {
        return attrs;
      }

      if (attrs.dataMap) {
        attrs.dataMap = ImmutableMap(attrs.dataMap);
      }

      attrs.missingScopes = ImmutableSet(attrs.missingScopes);
      attrs.pageLocation = ImmutableMap(attrs.pageLocation);
      return new Account(attrs);
    }
  }, {
    key: "createFromArray",
    value: function createFromArray(data) {
      return new List(data.map(Account.createFrom)).sortBy(function (c) {
        return c.name;
      });
    }
  }]);

  return Account;
}(Record(DEFAULTS));

export { Account as default };