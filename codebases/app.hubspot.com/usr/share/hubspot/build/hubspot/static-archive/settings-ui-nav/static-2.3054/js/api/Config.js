'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _urlMap;

import http from 'hub-http/clients/apiClient';
import NavItem from '../utils/NavItem';
import { navConfigSettingsV4Key, navConfigSettingsPreferencesKey, getSessionSetting, setSessionSetting } from '../utils/storageSettings';
var urlMap = (_urlMap = {}, _defineProperty(_urlMap, navConfigSettingsV4Key, 'navconfig/v4/navconfig/settings'), _defineProperty(_urlMap, navConfigSettingsPreferencesKey, 'navconfig/v2/navconfig/settings-preferences'), _urlMap);
export function parse(config) {
  var parsedConfig = [];

  try {
    if (config && config.children && config.children.length > 0) {
      var navItems = config.children;
      parsedConfig = navItems.map(function (navItem) {
        return new NavItem(null, navItem);
      });
    }
  } catch (e) {
    console.error(e);
  }

  return parsedConfig;
}
var cache = {};

var Config = /*#__PURE__*/function () {
  function Config() {
    _classCallCheck(this, Config);
  }

  _createClass(Config, null, [{
    key: "getLocal",
    value: function getLocal(navType) {
      var storedConfig = getSessionSetting(navType);
      return parse(storedConfig);
    }
  }, {
    key: "get",
    value: function get() {
      var navType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : navConfigSettingsV4Key;

      if (typeof cache[navType] === 'undefined') {
        var resource = urlMap[navType];
        cache[navType] = http.get(resource).then(function (config) {
          var parsedConfig = parse(config);
          setTimeout(function () {
            setSessionSetting(navType, config);
          }, 0);
          return parsedConfig;
        }).catch(function (onrejected) {
          if (onrejected.status === 404) {
            // We should be able to ignore
            return;
          } else {
            console.error(onrejected);
          }
        });
      }

      return cache[navType];
    }
  }]);

  return Config;
}();

export { Config as default };