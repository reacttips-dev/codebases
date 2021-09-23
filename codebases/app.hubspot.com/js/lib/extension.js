'use es6';

function getHubSpotSocialExtensionId() {
  return localStorage.overrideComposeExtensionId || 'edkibgpollgbhnjalcdlpmbjmdgohjko';
}

export function getHubSpotSocialExtensionUrl() {
  return "https://chrome.google.com/webstore/detail/" + getHubSpotSocialExtensionId();
}