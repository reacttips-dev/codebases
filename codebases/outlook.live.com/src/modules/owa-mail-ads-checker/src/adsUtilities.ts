import { isFeatureEnabled } from 'owa-feature-flags';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import {
    embargoedMarkets,
    getAdMarketPublishGroupCode,
    IsChildConsumerUser,
    IsPremiumConsumerUser,
    IsShadowMailboxUser,
} from 'owa-mail-ads-shared';
import { logUserAdConfigLazy } from 'owa-aduser-log';

var enableDisplayAds: boolean;
var showDisplayAds: boolean;
export function areDisplayAdsEnabled(): boolean {
    // caching this value as it doesn't change per session
    if (typeof showDisplayAds != 'undefined') {
        return showDisplayAds;
    }

    if (!isConsumer() || !isFeatureEnabled('fwk-ads')) {
        showDisplayAds = false;
    } else {
        let adsNotEnabledString = null;
        let adMarket = getAdMarketPublishGroupCode();

        // Make sure they have the AdsExperiments bit set and Display on is not set, then don't show ads
        if (IsPremiumConsumerUser()) {
            adsNotEnabledString = 'PremiumUser';
        } else if (IsShadowMailboxUser()) {
            adsNotEnabledString = 'ShadowMailboxUser';
        } else if (embargoedMarkets.includes(adMarket)) {
            adsNotEnabledString = 'EmbargoedMarket';
        } else if (IsChildConsumerUser()) {
            adsNotEnabledString = 'ChildAccount';
        }
        enableDisplayAds = adsNotEnabledString == null;
        showDisplayAds = adsNotEnabledString == null;

        if (enableDisplayAds && isFeatureEnabled('adsexp-DisplayOffNativeOn-treament')) {
            adsNotEnabledString = 'DisplayOffNativeOnAdExp';
            showDisplayAds = false;
        }

        if (
            enableDisplayAds &&
            !getUserConfiguration().UserOptions.IsFocusedInboxEnabled &&
            (isFeatureEnabled('adsExp-NativeInbox-e2-NoDisplayAd') ||
                isFeatureEnabled('adsExp-NativeInbox-e3-NoDisplayAd') ||
                isFeatureEnabled('adsExp-NativeInbox-e4-NoDisplayAd'))
        ) {
            adsNotEnabledString = 'NativeAdInboxNoDisplayAdExp';
            showDisplayAds = false;
        }

        logUserAdConfigLazy.importAndExecute(
            enableDisplayAds,
            adsNotEnabledString,
            adMarket,
            showDisplayAds
        );
    }

    return showDisplayAds;
}

export function setShowAds(value: any) {
    showDisplayAds = value;
}
