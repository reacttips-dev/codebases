'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { OrderedSet, Record } from 'immutable';
import { groupBy } from 'underscore';
var DEFAULTS = {
  id: null,
  userId: null,
  devicePlatform: null,
  deviceType: null,
  deviceName: null,
  appVersion: null,
  createdAt: null,
  updatedAt: null,
  timezone: null
};
var MIN_MAJOR_VERSION_FOR_INSTAGRAM = 2;
var MIN_MINOR_VERSION_FOR_INSTAGRAM = 25;

var AppInstall = /*#__PURE__*/function (_Record) {
  _inherits(AppInstall, _Record);

  function AppInstall() {
    _classCallCheck(this, AppInstall);

    return _possibleConstructorReturn(this, _getPrototypeOf(AppInstall).apply(this, arguments));
  }

  _createClass(AppInstall, [{
    key: "getOption",
    value: function getOption() {
      return {
        value: this.id,
        text: this.deviceName
      };
    }
  }, {
    key: "supportsInstagram",
    value: function supportsInstagram() {
      return this.platformSupportsInstagram() && this.getMajorVersion() >= MIN_MAJOR_VERSION_FOR_INSTAGRAM && this.getMinorVersion() >= MIN_MINOR_VERSION_FOR_INSTAGRAM;
    }
  }, {
    key: "platformSupportsInstagram",
    value: function platformSupportsInstagram() {
      return this.devicePlatform === 'IOS';
    }
  }, {
    key: "getMajorVersion",
    value: function getMajorVersion() {
      return parseInt(this.appVersion.split('.')[0], 10);
    }
  }, {
    key: "getMinorVersion",
    value: function getMinorVersion() {
      return parseInt(this.appVersion.split('.')[1], 10);
    }
  }], [{
    key: "createFrom",
    value: function createFrom(attrs) {
      return new AppInstall(attrs);
    }
  }, {
    key: "createFromResponse",
    value: function createFromResponse(data) {
      var installs = OrderedSet();
      Object.values(groupBy(data, function (i) {
        return i.userId;
      }) || {}).forEach(function (userInstallData) {
        // dedupe on deviceName, taking the most recent appVersion.
        var installsByDevice = OrderedSet(userInstallData.map(AppInstall.createFrom)).sortBy(function (i) {
          return i.appVersion;
        }).groupBy(function (i) {
          return i.deviceName;
        });
        installs = installs.concat(installsByDevice.map(function (is) {
          return is.last();
        }).sortBy(function (i) {
          return i.deviceName;
        }));
      });
      return installs.filter(function (i) {
        return i.platformSupportsInstagram();
      }).sortBy(function (i) {
        return -i.updatedAt;
      });
    }
  }]);

  return AppInstall;
}(Record(DEFAULTS));

export { AppInstall as default };