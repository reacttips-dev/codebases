import { Store } from 'redux';

import { didShowBanner } from 'actions/appAdvertisement';
import { userAgentStringToPlatform } from 'helpers/UserAgentUtils';
import marketplace from 'cfg/marketplace.json';

// TODO if/when someone types out all of marketplace, this can be moved to it
type AppPlatform = {
  platform: string; downloadUrl: string; styleType: string;
};
type AppAdMarketplaceConfig = {
  domain: string;
  branchAppKey: string;
  nativeApps: {
    ad?: {
      hideDays: number;
      header: string;
      tagLine: string;
      iosAppId: string;
      iosSmartBannerBaseUrl: string;
      showiOSBranchAd: boolean;
      showiOSNativeAd: boolean;
      showAndroidBranchAd: boolean;
    };
    platforms?: {
      android: AppPlatform;
      iphone: AppPlatform;
      ipad: AppPlatform;
    };
  };
};

const createAppAdvertisement = async (store: Store, navObject: Navigator = window.navigator, marketplaceConfig: AppAdMarketplaceConfig = marketplace, mockBranch: any /* for testing */) => {
  const { domain, branchAppKey, nativeApps : { ad, platforms } } = marketplaceConfig;
  const { cookies: { hideBranchAd }, headerFooter: { isHfVisible } } = store.getState();
  const platformName = userAgentStringToPlatform(navObject.userAgent);
  const platformExists = platformName && platforms?.[platformName];

  if (ad && platformName && platformExists && !hideBranchAd && isHfVisible) {
    // dynamically import branch sdk so we don't bloat vendor bundle and only import when its going to be used
    const branch = mockBranch || (await import('branch-sdk')).default;
    branch.addListener('didShowJourney', () => void store.dispatch(didShowBanner(true)));
    branch.addListener('didCloseJourney', () => void store.dispatch(didShowBanner(false)));
    branch.init(branchAppKey);
    // Most of these actually get overridden in the backend Journey config, but have sensible defaults here
    branch.banner({
      icon: require(`../images/${domain}-app-icon.png`),
      title: ad.header.replace('{platform}', platformName),
      description: ad.tagLine.replace('{platform}', platformName),
      showiOS: ad.showiOSBranchAd,
      showiPad: ad.showiOSBranchAd,
      showAndroid: ad.showAndroidBranchAd,
      forgetHide: ad.hideDays,
      downloadAppButtonText: 'Download',
      openAppButtonText: 'Open in app',
      iframe: false,
      showDesktop: false,
      showKindle: false,
      showBlackberry: false,
      showWindowsPhone: false,
      disableHide: false
    });
  }
};
export default createAppAdvertisement;

// Sometimes `closeJourney()` may not work and we must manually remove the banner
export function forceRemoveBranchAppAdBanner() {
  // Remove banner container
  const banner = document.getElementById('branch-banner-iframe');
  if (banner) {
    banner.remove();
  }
  // Remove styles on the body element that branch.io puts there
  document.body.style.marginTop = '';
  document.body.style.transition = '';
  // This library also adds a style tag in the <head/> we want to remove
  const bannerStyleTag = document.getElementById('branch-iframe-css');
  if (bannerStyleTag) {
    bannerStyleTag.remove();
  }
}
export function closeBranchAppAdBanner() {
  if (window.branch) {
    // https://help.branch.io/faq/docs/can-we-close-a-journey-programmatically
    window.branch.closeJourney(err => err && forceRemoveBranchAppAdBanner());
  }
}
