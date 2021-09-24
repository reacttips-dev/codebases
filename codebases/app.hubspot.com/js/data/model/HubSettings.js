'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _DEFAULTS;

import { Record, Set as ImmutableSet, Map as ImmutableMap } from 'immutable';
import I18n from 'I18n';
import { isArray, isObject, reduce } from 'underscore';
import { COMPOSER_NEXT_MESSAGE_DELAYS, LANDSCAPE_SETTING } from '../../lib/constants';
export var COMPOSER_NEXT_MESSAGE_DELAY_KEY = 'SocialComposerDelay';
export var HIDDEN_APP_INSTALL_KEY = 'Social:HiddenAppInstalls';
export var GDPR_COMPLIANCE_KEY = 'GDPRComplianceEnabled';
export var DEFAULTS = (_DEFAULTS = {
  loaded: false
}, _defineProperty(_DEFAULTS, HIDDEN_APP_INSTALL_KEY, ImmutableSet()), _defineProperty(_DEFAULTS, LANDSCAPE_SETTING, null), _defineProperty(_DEFAULTS, GDPR_COMPLIANCE_KEY, false), _defineProperty(_DEFAULTS, COMPOSER_NEXT_MESSAGE_DELAY_KEY, COMPOSER_NEXT_MESSAGE_DELAYS.nextSlot), _DEFAULTS); // we had a few strings go through JSON.stringify before saving; which results in an extra set of quotes

function removeWrappingQuotes(str) {
  if (str.startsWith('"') && str.startsWith('"')) {
    str = str.substr(1, str.length - 2);
  }

  return str;
}

var HubSettings = /*#__PURE__*/function (_Record) {
  _inherits(HubSettings, _Record);

  function HubSettings() {
    _classCallCheck(this, HubSettings);

    return _possibleConstructorReturn(this, _getPrototypeOf(HubSettings).apply(this, arguments));
  }

  _createClass(HubSettings, [{
    key: "getHiddenAppInstalls",
    value: function getHiddenAppInstalls() {
      return this[HIDDEN_APP_INSTALL_KEY];
    }
  }, {
    key: "getDelayOffset",
    value: function getDelayOffset() {
      var delay = this.get(COMPOSER_NEXT_MESSAGE_DELAY_KEY);

      if (delay === COMPOSER_NEXT_MESSAGE_DELAYS.nextSlot) {
        return 0;
      } else if (delay.startsWith('day')) {
        var days = parseInt(delay.replace('day', ''), 10);
        return I18n.moment.duration(days, 'days').asSeconds() * 1000;
      } else if (delay.startsWith('week')) {
        var weeks = parseInt(delay.replace('week', ''), 10);
        return I18n.moment.duration(weeks, 'weeks').asSeconds() * 1000;
      }

      return 0;
    } // Converts the data to an array format that the GDPR wrapper component expects
    // This way we can reuse our data without making duplicate calls using their actions

  }, {
    key: "serializeToArray",
    value: function serializeToArray() {
      var obj = this.toObject();
      var result = Object.keys(obj).map(function (key) {
        return {
          key: key,
          value: obj[key]
        };
      });
      return result;
    }
  }], [{
    key: "createFrom",
    value: function createFrom(attrs) {
      if (isArray(attrs)) {
        attrs = reduce(attrs, function (acc, _ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              key = _ref2[0],
              value = _ref2[1];

          acc[key] = value;
          return acc;
        }, {});
      }

      if (attrs[HIDDEN_APP_INSTALL_KEY]) {
        var appInstalls = JSON.parse(attrs[HIDDEN_APP_INSTALL_KEY]);
        attrs[HIDDEN_APP_INSTALL_KEY] = isArray(appInstalls) ? ImmutableSet(appInstalls) : ImmutableSet();
      }

      if (attrs[COMPOSER_NEXT_MESSAGE_DELAY_KEY]) {
        attrs[COMPOSER_NEXT_MESSAGE_DELAY_KEY] = removeWrappingQuotes(attrs[COMPOSER_NEXT_MESSAGE_DELAY_KEY]);
      }

      if (attrs[LANDSCAPE_SETTING]) {
        var landscapeSetting = JSON.parse(attrs[LANDSCAPE_SETTING]);
        attrs[LANDSCAPE_SETTING] = isObject(landscapeSetting) ? ImmutableMap(landscapeSetting) : ImmutableMap();
      }

      return new HubSettings(attrs);
    }
  }]);

  return HubSettings;
}(Record(DEFAULTS));

export { HubSettings as default };