import { getFullUrl } from 'hubspot-url-utils';

function getIsLocal() {
  try {
    return localStorage.getItem('UPGRADE_IFRAME_ENV') === 'local';
  } catch (e) {
    return false;
  }
}

export var getIframeModalHost = function getIframeModalHost() {
  return getFullUrl(getIsLocal() ? 'local' : 'app', {});
};