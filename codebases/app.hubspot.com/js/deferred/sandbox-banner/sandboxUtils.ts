import { GET } from 'unified-navigation-ui/utils/API';
import { sandboxBannerTemplate } from '../../../html/jsTemplates/sandboxBannerTemplate';
export function renderSandboxBanner(parentPortalId) {
  var sandboxBanner = document.createElement('div');
  sandboxBanner.innerHTML = sandboxBannerTemplate({
    url: parentPortalId
  });
  var navParent = document.getElementById('hs-nav-v4');
  var nav = document.getElementById('navbar');

  if (nav && navParent) {
    navParent.insertBefore(sandboxBanner, nav);
  }
}
export function getIsSandboxPortal(portalId, successCallback) {
  var path = "/hubs/v1/hubs/" + portalId + "/?portalId=" + portalId;
  GET(path, successCallback, {
    localOverride: 'NAVIGATION_SEARCH_ENV',
    subDomain: 'api',
    maxRetries: 2
  });
}
export function getSandboxPortalParent(portalId, successCallback) {
  var path = "/sandbox-hubs/v1/self/?portalId=" + portalId;
  GET(path, successCallback, {
    localOverride: 'NAVIGATION_SEARCH_ENV',
    onError: function onError() {
      return renderSandboxBanner();
    },
    subDomain: 'api',
    maxRetries: 1
  });
}