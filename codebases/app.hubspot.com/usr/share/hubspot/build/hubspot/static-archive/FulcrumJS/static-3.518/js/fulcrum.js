'use es6';

import userInfo from 'hub-http/userInfo';
import getDateDifference from './utils/getDateDifference';
import { MILLISECONDS, DAYS, WEEKS, MONTHS, YEARS } from './constants/dateUnits';
export default {
  getCreateDates: function getCreateDates() {
    return userInfo().then(function (_ref) {
      var user = _ref.user,
          portal = _ref.portal;
      return {
        user: user.created_at,
        portal: portal.created_at
      };
    });
  },
  getUserAge: function getUserAge() {
    var _this = this;

    return this.getCreateDates().then(function (_ref2) {
      var user = _ref2.user;
      return {
        days: _this.getDifferenceFromToday(user, DAYS),
        weeks: _this.getDifferenceFromToday(user, WEEKS),
        months: _this.getDifferenceFromToday(user, MONTHS),
        years: _this.getDifferenceFromToday(user, YEARS)
      };
    });
  },
  getPortalAge: function getPortalAge() {
    var _this2 = this;

    return this.getCreateDates().then(function (_ref3) {
      var portal = _ref3.portal;
      return {
        days: _this2.getDifferenceFromToday(portal, DAYS),
        weeks: _this2.getDifferenceFromToday(portal, WEEKS),
        months: _this2.getDifferenceFromToday(portal, MONTHS),
        years: _this2.getDifferenceFromToday(portal, YEARS)
      };
    });
  },
  getDifferenceFromUserCreated: function getDifferenceFromUserCreated(timestamp) {
    var unit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DAYS;
    return this.getCreateDates().then(function (_ref4) {
      var user = _ref4.user;
      return getDateDifference(user, timestamp, unit);
    });
  },
  getDifferenceFromPortalCreated: function getDifferenceFromPortalCreated(timestamp) {
    var unit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DAYS;
    return this.getCreateDates().then(function (_ref5) {
      var portal = _ref5.portal;
      return getDateDifference(portal, timestamp, unit);
    });
  },
  getDifferenceFromToday: function getDifferenceFromToday(timestamp) {
    var unit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DAYS;
    var today = Date.now();
    return getDateDifference(today, timestamp, unit);
  },
  getUserCreatedAfter: function getUserCreatedAfter(timestamp) {
    return this.getDifferenceFromUserCreated(timestamp, MILLISECONDS).then(function (diff) {
      return diff >= 0;
    });
  },
  getUserCreatedBefore: function getUserCreatedBefore(timestamp) {
    return this.getUserCreatedAfter(timestamp).then(function (isAfter) {
      return !isAfter;
    });
  },
  getPortalCreatedAfter: function getPortalCreatedAfter(timestamp) {
    return this.getDifferenceFromPortalCreated(timestamp, MILLISECONDS).then(function (diff) {
      return diff >= 0;
    });
  },
  getPortalCreatedBefore: function getPortalCreatedBefore(timestamp) {
    return this.getPortalCreatedAfter(timestamp).then(function (isAfter) {
      return !isAfter;
    });
  }
};