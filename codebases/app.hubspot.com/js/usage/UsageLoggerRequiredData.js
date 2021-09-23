'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { connectPromiseSingle } from 'crm_data/flux/connectPromiseSingle';
import User from 'hub-http-shims/UserDataJS/user';
import SettingsStore from 'crm_data/settings/SettingsStore';
import PortalAndUserAge from './PortalAndUserAge';
import SidekickExtensionInstallHelpers from 'ExtensionInstallHelpers.SidekickExtensionInstallHelpers';
import requiredData from 'customer-data-tracking/constants/requiredData';
var PORTAL_AGE_DAYS = requiredData.PORTAL_AGE_DAYS,
    PORTAL_AGE_MONTHS = requiredData.PORTAL_AGE_MONTHS,
    USER_AGE_DAYS = requiredData.USER_AGE_DAYS,
    USER_AGE_MONTHS = requiredData.USER_AGE_MONTHS,
    USAGE_PORTAL_FIRST_WEEK = requiredData.USAGE_PORTAL_FIRST_WEEK,
    CHROME_EXTENSION_INSTALLED = requiredData.CHROME_EXTENSION_INSTALLED,
    USER_WAS_INVITED = requiredData.USER_WAS_INVITED;
var settingsStoreFetcher = connectPromiseSingle(SettingsStore, function (settings) {
  return !settings;
});

var getAgeProperties = function getAgeProperties() {
  var _ref;

  var agesPromise = PortalAndUserAge.get();
  return _ref = {}, _defineProperty(_ref, PORTAL_AGE_DAYS, function () {
    return agesPromise.then(function (ages) {
      return ages.getIn(['portal', 'days']);
    });
  }), _defineProperty(_ref, PORTAL_AGE_MONTHS, function () {
    return agesPromise.then(function (ages) {
      return ages.getIn(['portal', 'months']);
    });
  }), _defineProperty(_ref, USAGE_PORTAL_FIRST_WEEK, function () {
    return agesPromise.then(function (ages) {
      return ages.getIn(['user', 'days']) <= 7;
    });
  }), _defineProperty(_ref, USER_AGE_DAYS, function () {
    return agesPromise.then(function (ages) {
      return ages.getIn(['user', 'days']);
    });
  }), _defineProperty(_ref, USER_AGE_MONTHS, function () {
    return agesPromise.then(function (ages) {
      return ages.getIn(['user', 'months']);
    });
  }), _ref;
};

var getUserWasInvited = function getUserWasInvited() {
  return Promise.all([settingsStoreFetcher(), User]).then(function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
        settings = _ref3[0],
        userManager = _ref3[1];

    var creatorUserId = settings && settings.get('crm:signup:creator');
    var userId = userManager && userManager.get('user_id');
    return settings ? parseInt(creatorUserId, 10) !== userId : null;
  });
};

var isWordPress = function isWordPress() {
  return /(^|\?|&)wp=/.test(window.location.search);
};

export function get() {
  var _Object$assign;

  return Object.assign({}, getAgeProperties(), (_Object$assign = {}, _defineProperty(_Object$assign, CHROME_EXTENSION_INSTALLED, SidekickExtensionInstallHelpers.hasExtension()), _defineProperty(_Object$assign, USER_WAS_INVITED, getUserWasInvited), _defineProperty(_Object$assign, 'wordpress-plugin', isWordPress()), _Object$assign));
}