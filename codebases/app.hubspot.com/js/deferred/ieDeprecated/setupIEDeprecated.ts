import { iedDeprecatedBannerTemplate } from '../../../html/jsTemplates/ieDeprecatedBannerTemplate';
import { get, set } from '../../utils/tempStorage'; // To match this check https://git.hubteam.com/HubSpotProtected/LoginUI/pull/863/files#diff-6e35a97b4d55a47b7d8f41888a3631279baa66fe67f044c352f0803cbaa61630R11

var isIE11 = /Trident\/|MSIE/.test(window.navigator.userAgent);
var ieLocalStorageKey = 'ieWarningDismissed';
export function setupIEDeprecated() {
  if (isIE11 && !get(ieLocalStorageKey)) {
    var ieBanner = document.createElement('div');
    ieBanner.innerHTML = iedDeprecatedBannerTemplate();
    var navParent = document.getElementById('hs-nav-v4');
    var nav = document.getElementById('navbar');

    if (nav && navParent) {
      navParent.insertBefore(ieBanner, nav);
    }

    document.querySelector('[data-ieDismissButton]').addEventListener('click', function () {
      set(ieLocalStorageKey, 'IEDismissed');
      ieBanner.style.display = 'none';
    });
  }
}