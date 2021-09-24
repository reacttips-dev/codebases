'use es6';

import { getFullUrl } from 'hubspot-url-utils';
var ALLOW_ORIGIN = '*';
export function sendMessageToParent(data) {
  window.parent.postMessage(data, ALLOW_ORIGIN);
}
export function sendMessageToChild(childElem, data) {
  childElem.contentWindow.postMessage(data, ALLOW_ORIGIN);
}
export function getHostUrl() {
  var localOverride = localStorage.getItem('integrations-directory-panel-embed-host-url');

  if (localOverride) {
    return "//" + localOverride;
  }

  return getFullUrl('app');
}