'use es6';

import checkIfWordPress from './checkIfWordPress';
import { isFramed } from './frameUtils';
import getLeadinConfig from './getLeadinConfig';
import showWarnings from './showWarnings';

function notifyLocationChange(location) {
  try {
    window.top.postMessage(JSON.stringify({
      leadin_sync_route: location.pathname,
      leadin_sync_search: location.search
    }), '*');
  } catch (e) {//
  }
}

export function setRaven(Raven) {
  var _getLeadinConfig = getLeadinConfig(),
      leadinPluginVersion = _getLeadinConfig.leadinPluginVersion,
      phpVersion = _getLeadinConfig.phpVersion,
      wpVersion = _getLeadinConfig.wpVersion;

  try {
    if (checkIfWordPress()) {
      Raven.setTagsContext({
        v: leadinPluginVersion,
        php: phpVersion,
        wp: wpVersion
      });
    }
  } catch (e) {//
  }
}
export function setHistory(history) {
  try {
    if (checkIfWordPress()) {
      if (typeof history.listen === 'function') {
        history.listen(function () {
          return notifyLocationChange(window.location);
        });
      } else if (typeof history.on === 'function') {
        history.on('route', function () {
          return notifyLocationChange(window.location);
        });
      }

      notifyLocationChange(window.location);
    }
  } catch (e) {//
  }
}
export function setWordPressGlobal() {
  if (!window.hubspot) {
    window.hubspot = {};
  }

  if (typeof window.hubspot.wordpress === 'undefined') {
    window.hubspot.wordpress = isFramed() && !!getLeadinConfig().wpVersion;
  }

  return window.hubspot.wordpress;
}
export default function initWordPress(Raven, history, DEPRECATED_usageTracker, DEPRECATED_promiseStatus) {
  try {
    setWordPressGlobal();

    if (checkIfWordPress()) {
      var hsNav = document.getElementById('hs-nav-v4');

      if (hsNav) {
        hsNav.classList.add('wordpress-plugin-nav');
      } else if (Raven) {
        Raven.captureMessage('[ Wordpress-Plugin ] : could not append class to the HubSpot nav');
      }

      var style = document.createElement('style');
      style.type = 'text/css';
      var css = "#hs-nav-v4 { display: none; }\n      .contacts > #hs-nav-v4~.app { height: 100vh !important; }";

      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }

      document.getElementsByTagName('head')[0].appendChild(style);

      if (Raven) {
        setRaven(Raven);
      }

      if (history) {
        setHistory(history);
      }

      showWarnings();
    }
  } catch (e) {//
  }

  return DEPRECATED_promiseStatus || Promise.resolve();
}