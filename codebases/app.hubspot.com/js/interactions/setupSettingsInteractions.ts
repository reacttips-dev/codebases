import SettingsURLMappings from 'unified-navigation-ui/constants/SettingsURLMappings';
import navQuerySelector from 'unified-navigation-ui/utils/navQuerySelector';
import getOrigin from 'unified-navigation-ui/utils/getOrigin';
import { getPortalId } from 'unified-navigation-ui/js/utils/getPortalId';

var getSettingsLink = function getSettingsLink() {
  var pathParts = /^\/([\w-]+)\/\d+/.exec(window.location.pathname);
  var currentPath = pathParts && pathParts.length >= 1 ? pathParts[1] : null;
  return Object.keys(SettingsURLMappings).reduce(function (path, type) {
    if (path !== null) {
      return path;
    }

    var _SettingsURLMappings$ = SettingsURLMappings[type],
        from = _SettingsURLMappings$.from,
        to = _SettingsURLMappings$.to;
    var toLink = "" + getOrigin() + to.replace('**{portalId}**', "" + getPortalId());

    if (currentPath === from || from instanceof RegExp && from.test(window.location.pathname)) {
      return toLink;
    }

    return path;
  }, null);
};

var originalSettingsLink = null;

var getOriginalSettingsLink = function getOriginalSettingsLink() {
  if (originalSettingsLink === null) {
    originalSettingsLink = navQuerySelector('#navSetting').href;
  }

  return originalSettingsLink;
};

var updateSettingsLink = function updateSettingsLink() {
  var link = getSettingsLink() || getOriginalSettingsLink();
  var href = link + "?eschref=" + encodeURIComponent(window.location.pathname);
  navQuerySelector('#navSetting').href = href;
  navQuerySelector('#userPreferences').href = href;
};

var monkeyPathHistory = function monkeyPathHistory(func) {
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    func.apply(window.history, args);
    updateSettingsLink();
  };
};

export default function setupSettingsInteractions() {
  updateSettingsLink();
  var _window = window,
      history = _window.history;
  var pushState = history.pushState,
      replaceState = history.replaceState;
  history.pushState = monkeyPathHistory(pushState);
  history.replaceState = monkeyPathHistory(replaceState);
}