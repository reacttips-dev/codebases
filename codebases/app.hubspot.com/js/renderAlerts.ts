import navQuerySelector from 'unified-navigation-ui/utils/navQuerySelector';
import each from 'unified-navigation-ui/utils/each';
import * as tempStorage from 'unified-navigation-ui/utils/tempStorage';
import { text } from 'unified-navigation-ui/utils/NavI18n';
import { GET } from 'unified-navigation-ui/utils/API';
import { alertTemplate } from '../html/jsTemplates/alertTemplate';
import { getPortalId } from 'unified-navigation-ui/js/utils/getPortalId';
var HIDDEN_ALERT_DURATION_MILLIS = window.hubspot && window.hubspot.navigation && window.hubspot.navigation.hiddenAlertDurationMillis || 1209600000; // Two weeks fallback

var LOCAL_STORAGE_KEY_PREFIX = 'NAVIGATION_HIDDEN_ALERTS';

function getHiddenAlertStorageKey() {
  var alertType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'nonFill';
  return LOCAL_STORAGE_KEY_PREFIX + ":" + getPortalId() + ":" + alertType;
}

function getHiddenAlertTimestampFromStorage(alertType) {
  var hiddenAlertRaw = tempStorage.get(getHiddenAlertStorageKey(alertType));
  return hiddenAlertRaw ? JSON.parse(hiddenAlertRaw) : null;
}

function renderAlert(alert) {
  var alertType = alert.alertType;
  var hiddenAlertTimestamp = getHiddenAlertTimestampFromStorage(alertType);
  var now = new Date();

  if (hiddenAlertTimestamp && new Date(hiddenAlertTimestamp + HIDDEN_ALERT_DURATION_MILLIS) > now) {
    return;
  }

  var alertDiv = document.createElement('div');
  alertDiv.innerHTML = alertTemplate({
    level: alert.level,
    link: alert.link,
    title: text("nav.alerts." + alertType + ".title"),
    description: text("nav.alerts." + alertType + ".description"),
    linkText: text("nav.alerts." + alertType + ".linkText")
  });

  if (alertDiv && alertDiv.parentNode) {
    alertDiv.querySelector('svg.close-icon').addEventListener('click', function () {
      alertDiv.parentNode.removeChild(alertDiv);
      tempStorage.set(getHiddenAlertStorageKey(alertType), +now);
    });
  }

  navQuerySelector().parentNode.insertBefore(alertDiv, navQuerySelector());
}

export default function renderAlerts() {
  var cb = function cb(alertsToBeRendered) {
    each(alertsToBeRendered, function (alert) {
      return renderAlert(alert);
    });
  };

  if (window.hubspot && window.hubspot.navigation && window.hubspot.navigation.alerts) {
    cb(window.hubspot.navigation.alerts);
  } else {
    GET("/navconfig/v2/alerts?portalId=" + getPortalId(), cb, {
      localOverride: 'NAVIGATION_CONFIG_ENV',
      subDomain: 'app',
      maxRetries: 5
    });
  }
}