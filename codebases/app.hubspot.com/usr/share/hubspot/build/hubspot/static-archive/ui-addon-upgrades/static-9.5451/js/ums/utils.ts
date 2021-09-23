import Raven from 'Raven';
import { findDOMNode } from 'react-dom';
import PortalIdParser from 'PortalIdParser';
import http from 'hub-http/clients/apiClient';
import { getFullUrl } from 'hubspot-url-utils';
import { getIframeModalHost } from '../_core/utils/getIframeModalHost';
var upgradePointPromises = {};
export var upgradePointViews = {};
export function getApp() {
  return window.location.pathname.split('/')[1];
}
export function getScreen() {
  return window.location.pathname;
}
export function verifyMessage(ref, event) {
  var node = findDOMNode(ref.current);
  return node && node.contentWindow === event.source;
}
export function matchMessage(event, message) {
  return event.data === message;
}
export function createFrameSrc(_ref) {
  var upgradeKey = _ref.upgradeKey,
      app = _ref.app,
      screen = _ref.screen,
      portalId = _ref.portalId;
  return getIframeModalHost() + "/ums-modal/" + portalId + "/" + upgradeKey + "?app=" + app + "&screen=" + screen;
}
export function getFrameSrc(upgradeKey) {
  return createFrameSrc({
    upgradeKey: upgradeKey,
    app: getApp(),
    screen: getScreen(),
    portalId: PortalIdParser.get()
  });
}

function fetchUpgradePoint(upgradeKey) {
  if (!upgradeKey) {
    return Promise.resolve();
  }

  return http.get(getFullUrl('api', {}) + "/upgrade-management-service/v1/upgrade-configs/" + upgradeKey).catch(function (error) {
    var message = 'UpgradeManagement API Failure';
    Raven.captureMessage(message, {
      extra: {
        error: error
      }
    });
    return Promise.reject(new Error(message));
  });
}

export function delayUntilIdle(callback) {
  window.setTimeout(callback, 5000);
}
export function getUpgradePointPromise(upgradeKey) {
  if (upgradePointPromises[upgradeKey]) {
    return upgradePointPromises[upgradeKey];
  }

  var upgradePointPromise = new Promise(function (resolve) {
    delayUntilIdle(function () {
      resolve(fetchUpgradePoint(upgradeKey));
    });
  });
  upgradePointPromises[upgradeKey] = upgradePointPromise;
  return upgradePointPromise;
}
export function getTrackingProperties(upgradePoint) {
  return Object.assign({}, upgradePoint, {
    app: getApp()
  });
}