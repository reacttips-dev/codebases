import isApp from './isApp';
import isLocalEnv from './isLocalEnv';
import isNotificationsDebug from './isNotificationsDebug';
import isNotificationsDisable from './isNotificationsDisable';
import isQA from './isQA';
import { bender } from 'legacy-hubspot-bender-context';
import loadScript from './loadScript';
import loadStyles from './loadStyles';
import { getPortalId } from 'unified-navigation-ui/js/utils/getPortalId';

function getLivePathUrl(scriptBasePath) {
  return "" + scriptBasePath + (isQA() ? '-qa' : '') + ".js";
}

export function loadIframe(iframeSrc) {
  var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  attributes.height = attributes.height || '0';
  attributes.width = attributes.width || '0';
  attributes.style = attributes.style || 'display: none';
  var iframe = document.createElement('iframe');
  iframe.setAttribute('src', iframeSrc);

  if (attributes.onload) {
    iframe.onload = attributes.onload;
    delete attributes.onload;
  }

  if (attributes.onerror) {
    iframe.onerror = attributes.onerror;
    delete attributes.onerror;
  }

  Object.keys(attributes).map(function (key) {
    iframe.setAttribute(key, attributes[key]);
    return key;
  });
  document.body.appendChild(iframe);
}

function hasScope(scopes, scope) {
  return scopes.indexOf(scope) >= 0;
}

function loadWootric() {
  if (!window.hubspot || !window.hubspot.wootricDisabled) {
    loadScript(getLivePathUrl('//static.hsappstatic.net/wootric-nps/ex/nps-loader'));
  }
}

function loadDeactivatedUserRedirector() {
  if (!window.hubspot || !window.hubspot.redirectorDisabled) {
    loadScript(getLivePathUrl('//static.hsappstatic.net/deactivated-user-redirector/ex/js/redirector_loader'));
  }
}

function loadNotificationsSidebar() {
  if (isNotificationsDisable()) {
    return;
  }

  loadScript(getLivePathUrl('//static.hsappstatic.net/notification-sidebar/ex/js/notificationSidebarLoader'));
} // function loadFireAlarm() {
//   if (!(window as any).hubspot || !(window as any).hubspot.fireAlarmDisabled) {
//     loadScript(
//       getLivePathUrl(
//         '//static.hsappstatic.net/FireAlarmUi/ex/js/FireAlarmLoader'
//       )
//     );
//   }
// }


function loadTeaseNotifications(scopes) {
  if (hasScope(scopes, 'notifications-access') && isApp()) {
    if (isLocalEnv() && !isNotificationsDebug()) {
      return;
    }

    if (isNotificationsDisable()) {
      return;
    }

    loadIframe("/notifications/" + getPortalId() + "/iframe", {
      id: 'notifications-iframe'
    });
  }
}

function shouldShowZorse() {
  return !window.hubspot.zorse || !window.hubspot.zorse.supressed;
}

function loadZorse() {
  window.hubspot = window.hubspot || {};
  window.hubspot.zorseScriptURL = getLivePathUrl('//static.hsappstatic.net/ZorseButtonUI/ex/coffee/button_injector');

  if (shouldShowZorse()) {
    loadScript(window.hubspot.zorseScriptURL);
  }
}

function loadDeferredNavSetup() {
  loadStyles("" + bender.staticDomainPrefix + bender.depPathPrefixes[bender.project] + "/bundles/nav-deferred.css");
}

export function loadNavigation() {
  // should be
  var domain = document.domain.toLowerCase() || '';
  var isDevelopmentMode = process.env.NODE_ENV === 'development';
  var domainSuffix = domain.indexOf('qa') >= 0 ? 'qa' : '';
  var prefix = isDevelopmentMode ? 'local' : 'app';

  if (!window.hubspot || !window.hubspot.globalNavigationUI) {
    loadStyles("https://" + prefix + ".hubspot" + domainSuffix + ".com/global-navigation-ui/project.css");
    loadScript("https://" + prefix + ".hubspot" + domainSuffix + ".com/global-navigation-ui/project.js");
  }
}
var loadDependentsInterval = null;
var tries = 0;

var loadDependents = function loadDependents(scopes, startTime) {
  var MIN_PARENT_ASSET_LOADING_THRESHOLD = 3000;

  if (document.readyState === 'complete' && Date.now() - startTime > MIN_PARENT_ASSET_LOADING_THRESHOLD && tries < 1) {
    tries++;

    if (loadDependentsInterval) {
      clearInterval(loadDependentsInterval);
    }

    loadNotificationsSidebar(); // loadFireAlarm();

    loadTeaseNotifications(scopes);
    loadZorse();
    loadWootric();
    loadDeactivatedUserRedirector();
  }
};

export default function loadDependentScripts(scopes) {
  loadDeferredNavSetup();

  if (!scopes && !getPortalId()) {
    return;
  }

  var startTime = Date.now();
  loadDependentsInterval = setInterval(loadDependents, 250, scopes, startTime);
}