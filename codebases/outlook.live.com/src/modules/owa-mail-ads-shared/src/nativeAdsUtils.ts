import NativeAdInitialProvider from './NativeAdInitialProvider';
import NativeAdPlacement from './NativeAdPlacement';
import consumerAdsExperimentModeSetValue from './utils/consumerAdsExperimentModeSetValue';
import { updateConsumerAdsExperimentMode } from './utils/updateConsumerAdsExperimentMode';
import { isFeatureEnabled } from 'owa-feature-flags';
import { isConsumer } from 'owa-session-store';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import {
    embargoedMarkets,
    getAdMarketPublishGroupCode,
    IsChildConsumerUser,
    IsPremiumConsumerUser,
    IsShadowMailboxUser,
} from './sharedAdsUtils';

export const BING_SUPPORTED_MARKETS = [
    'en-us',
    'en-gb',
    'en-ca',
    'en-au',
    'fr-fr',
    'de-de',
    'en-de',
];

let nativeAdInitialProvider: NativeAdInitialProvider;
let nativeAdEnableOrNot: boolean;
let nativeAdInitialPlacement: NativeAdPlacement;

let userMarket: string;

/*
Get the initial Ad provider for the user
As the Bing flight scope is smaller than Prebid/AppNexus, we check Bing flight first
When Prebid and AppNexus overlap, we use Prebid first as AppNexus is a subset of Prebid which usually acts as the backup plan when Prebid has some issues
*/
export function getNativeAdInitialProviderForUser(): NativeAdInitialProvider {
    if (!nativeAdInitialProvider) {
        const userMarket = getAdMarketPublishGroupCode();

        if (
            isFeatureEnabled('fwk-nativeAds-bingOneClickOtherInboxOnly') &&
            BING_SUPPORTED_MARKETS.indexOf(userMarket) > -1
        ) {
            nativeAdInitialProvider = NativeAdInitialProvider.Bing;
        } else {
            nativeAdInitialProvider = NativeAdInitialProvider.Prebid;
        }
    }
    return nativeAdInitialProvider;
}

/*
Get the Ad initial placement. The flow is below:
1. Users which are in the following categories do not get native Ads
-- None of the native ads flight is enabled for this user
-- Ad free user
-- Child account
-- User is in a non-supported market
2. If the user is not Focus Inbox enabled, we will show the Ad according to his experimental flight
3. For other users (most set), show the Ad in Other pivot only
*/
export function getNativeAdInitialPlacement(): NativeAdPlacement {
    if (!nativeAdInitialPlacement) {
        if (!getNativeAdEnabledOrNotFromUserProperties()) {
            nativeAdInitialPlacement = NativeAdPlacement.None;
        } else if (!getUserConfiguration().UserOptions.IsFocusedInboxEnabled) {
            const resetAdShowCount = getInboxNativeAdExpResetCount();

            if (resetAdShowCount != -1) {
                let currentAdShowCount = consumerAdsExperimentModeSetValue(
                    getUserConfiguration().UserOptions.ConsumerAdsExperimentMode
                );
                if (currentAdShowCount == 0 || currentAdShowCount >= resetAdShowCount) {
                    updateConsumerAdsExperimentMode(1);
                    nativeAdInitialPlacement = NativeAdPlacement.OtherPrefer;
                } else if (currentAdShowCount < resetAdShowCount) {
                    const newCount =
                        currentAdShowCount + 1 == resetAdShowCount ? 0 : currentAdShowCount + 1;
                    updateConsumerAdsExperimentMode(newCount);
                    nativeAdInitialPlacement = NativeAdPlacement.OtherOnly;
                }
            } else {
                nativeAdInitialPlacement = NativeAdPlacement.OtherOnly;
            }
        } else {
            nativeAdInitialPlacement = NativeAdPlacement.OtherOnly;
        }
    }

    return nativeAdInitialPlacement;
}

/*
Some checks are on the user which will never change during an OWA session
Cache this value so that it will not be calculated again and again
*/
export function getNativeAdEnabledOrNotFromUserProperties(): boolean {
    if (typeof nativeAdEnableOrNot != 'undefined') {
        return nativeAdEnableOrNot;
    }

    nativeAdEnableOrNot = false;

    // Do not log the business user session to decrease the noise in the datapoint
    if (!isConsumer()) {
        return nativeAdEnableOrNot;
    }

    userMarket = getAdMarketPublishGroupCode();

    if (
        !isFeatureEnabled('fwk-nativeAds-bingOneClickOtherInboxOnly') &&
        !isFeatureEnabled('fwk-nativeAds-prebidOneClickOtherInboxOnly')
    ) {
        return nativeAdEnableOrNot;
    }

    if (IsPremiumConsumerUser()) {
        return nativeAdEnableOrNot;
    }

    if (IsShadowMailboxUser()) {
        return nativeAdEnableOrNot;
    }

    if (IsChildConsumerUser()) {
        return nativeAdEnableOrNot;
    }

    if (embargoedMarkets.indexOf(userMarket) > -1) {
        return nativeAdEnableOrNot;
    }

    nativeAdEnableOrNot = true;

    return nativeAdEnableOrNot;
}

function getInboxNativeAdExpResetCount(): number {
    if (
        isFeatureEnabled('adsexp-DisplayOffNativeOn-treament') &&
        isFeatureEnabled('adsExp-DONO-AdInPrimary-e1')
    ) {
        return 1;
    } else if (isFeatureEnabled('adsExp-NativeInbox-e2-NoDisplayAd')) {
        return 2;
    } else if (
        isFeatureEnabled('adsExp-NativeInbox-e3-NoDisplayAd') ||
        isFeatureEnabled('adsExp-NativeInbox-e3-DisplayAd')
    ) {
        return 3;
    } else if (isFeatureEnabled('adsExp-NativeInbox-e4-NoDisplayAd')) {
        return 4;
    }

    return -1;
}

// This is only used for test
export function resetNativeAdCacheValueForTest() {
    nativeAdInitialProvider = undefined;
    nativeAdEnableOrNot = undefined;
    nativeAdInitialPlacement = undefined;
}
