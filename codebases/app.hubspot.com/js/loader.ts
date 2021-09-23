import loadScript from 'unified-navigation-ui/utils/loadScript';
import loadCriticalCSS from 'unified-navigation-ui/utils/loadCriticalCSS';
import { bender } from 'legacy-hubspot-bender-context';
import * as tempStorage from 'unified-navigation-ui/utils/tempStorage';
window.hubspot = window.hubspot || {};
window.hubspot.nav = window.hubspot.nav || {};

if (!window.hubspot.nav.promise) {
  window.hubspot.nav.promise = function () {
    var handlers = [];
    var resolved = false;
    return {
      resolve: function resolve() {
        resolved = true;
        handlers.map(function (handler) {
          handler();
          return handler;
        });
      },
      then: function then(handler) {
        if (resolved) {
          handler();
        } else {
          handlers.push(handler);
        }
      }
    };
  }();
}

var smokeTestNavAsset = tempStorage.get('smokeTestNavAsset');
var loadAssets = smokeTestNavAsset || bender.depPathPrefixes[bender.project];

if (!window.hubspot || !window.hubspot.fireAlarmDisabled) {
  loadScript('//static.hsappstatic.net/FireAlarmUi/ex/js/FireAlarmLoader.js');
}

loadScript("" + bender.staticDomainPrefix + loadAssets + "/bundles/project.js");
loadCriticalCSS();