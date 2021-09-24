'use es6';

import { getUserInfo } from 'ui-addon-upgrades/_core/common/api/getUserInfo';
import { BILLING, MARKETABLE_CONTACTS_WRITE, TEAM } from 'ui-addon-upgrades/_core/common/constants/AdminTypes';
import logError from 'ui-addon-upgrades/_core/common/reliability/logError';
export var isAdmin = function isAdmin(user) {
  var adminType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : TEAM;

  if (adminType === BILLING) {
    var isBillingAdmin = user.scopes.indexOf('billing-write') !== -1;
    return isBillingAdmin;
  }

  if (adminType === MARKETABLE_CONTACTS_WRITE) {
    var hasMCWrite = user.scopes.indexOf('marketable-contacts-write') !== -1;
    return hasMCWrite;
  }

  var isHubOwner = user.scopes.indexOf('hub-owner') !== -1;
  var isJitaAdmin = user.scopes.indexOf('hub-parcel-write') !== -1;
  return isHubOwner || isJitaAdmin;
};
export var getIsAdmin = function getIsAdmin(adminType) {
  return getUserInfo().then(function (_ref) {
    var user = _ref.user;
    return isAdmin(user, adminType);
  }).catch(function (err) {
    logError('getIsAdmin', err);
    return false;
  });
};