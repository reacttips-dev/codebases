import { developerBannerTemplate } from '../../../html/jsTemplates/developerBannerTemplate';
var ACCOUNT_TYPES_DOC = 'https://developers.hubspot.com/hubspot-account-types';
export function setupDeveloperBanner(isDeveloperPortal) {
  if (isDeveloperPortal) {
    var sandboxBanner = document.createElement('div');
    sandboxBanner.innerHTML = developerBannerTemplate({
      url: ACCOUNT_TYPES_DOC
    });
    var navParent = document.getElementById('hs-nav-v4');
    var nav = document.getElementById('navbar');

    if (nav && navParent) {
      navParent.insertBefore(sandboxBanner, nav);
    }
  }
}