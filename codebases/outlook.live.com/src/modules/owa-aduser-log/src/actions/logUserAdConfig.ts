import getAdExpFlights from '../utils/getAdExpFlights';
import { TCString } from '@iabtcf/core';
import { updateWasAdLastSeenInLastSessionLazy } from 'owa-aduser-updateconfig';
import { PerformanceDatapoint } from 'owa-analytics';
import { calculateCookieTargeting, cookieTargetingStore } from 'owa-cookie-targeting';
import { loadGdprTcfTCString } from 'owa-gdpr-ad-tcf';
import { getLiveRampEnvelopId } from 'owa-liveramp';
import { getUserConfiguration } from 'owa-session-store';
import {
    getAnidCookie,
    getMarketCountryCode,
    isGdprAdMarket,
    isLgpdAdFlightEnabled,
    isLgpdAdMarket,
} from 'owa-mail-ads-shared';

export default async function logUserAdConfig(
    enableDisplayAds: boolean,
    adsNotEnabledString: string,
    adMarket: string,
    showDisplayAds: boolean
) {
    const adUserConfigDataPoint = new PerformanceDatapoint('UserAdConfig', {
        isCore: true,
    });

    // Check Native Ads data
    let showNativeAds = enableDisplayAds;
    let nativeadOffReason = 'NA';

    if (showNativeAds) {
        const isFocusInboxEnabled = getUserConfiguration().UserOptions.IsFocusedInboxEnabled;
        let inboxPlusTabsNonFocusEnabled = false;
        const inboxPlusTabs = getUserConfiguration().UserOptions.InboxPlusTabs;
        inboxPlusTabsNonFocusEnabled = inboxPlusTabs?.length > 1;

        if (!isFocusInboxEnabled && !inboxPlusTabsNonFocusEnabled) {
            showNativeAds = false;
            nativeadOffReason = 'FocusInboxInboxPlusTabsOff';
        }
    }

    await calculateCookieTargeting();

    // Check Lgpd
    const lgpdapplies = isLgpdAdFlightEnabled() && isLgpdAdMarket();

    // Check GDPR data
    const gdprapplies = isGdprAdMarket();
    let gdprConsentDataString = 'NA';
    let consentStringPurpose = [];
    if (gdprapplies) {
        gdprConsentDataString = await loadGdprTcfTCString();

        if (gdprConsentDataString?.length > 0) {
            const tcModel = TCString.decode(gdprConsentDataString);
            tcModel.purposeConsents.forEach((value: boolean, id: number): void => {
                if (value) {
                    consentStringPurpose.push(id);
                }
            });

            if (consentStringPurpose == null || consentStringPurpose.length == 0) {
                // Set consent string purpose to 0 to be easier logging to show the user has opted out everything
                consentStringPurpose = [0];
            }
        } else {
            // Set the consent string purpose to -1 to easy logging as there is no valid GDPR consent string out
            consentStringPurpose = [-1];
        }
    } else {
        // Set consent string purpose to -2 to indicate this is a nonGDPR user for easy logging
        consentStringPurpose = [-1];
    }

    // Check Ads optout value
    let liveRampEnvelopeId: string;
    if (cookieTargetingStore.effectiveOptInValue) {
        let userCookieId = getAnidCookie();
        liveRampEnvelopeId = await getLiveRampEnvelopId(userCookieId);
    }

    // Get the prime settings
    let primeSettings = getUserConfiguration()?.PrimeSettings;
    let adsAggregateOption: any;

    if (primeSettings?.Items) {
        for (let primeSetting of primeSettings.Items) {
            if (primeSetting.Id === 'AdsAggregateOptions') {
                adsAggregateOption = primeSetting.Value?.options?.[0];
                break;
            }
        }
    }
    adUserConfigDataPoint.addCustomData({
        AdsEnabled: enableDisplayAds,
        NotEnabledReason: adsNotEnabledString,
        UserAdCountry: getMarketCountryCode(adMarket),
        CalculatedAdMarket: adMarket,
        DisplayAdsOn: showDisplayAds,
        NativeAdsOn: showNativeAds,
        DisplayOffReason: enableDisplayAds && !showDisplayAds ? adsNotEnabledString : 'NA',
        NativeOffReason: nativeadOffReason,
        LGPDApplies: lgpdapplies,
        LGPDOptInStatus: lgpdapplies ? cookieTargetingStore.lgpdOptInBit : -1,
        FirstPartyCookieOptOut: gdprapplies
            ? cookieTargetingStore.gdprFirstPartyCookieOptInBit != 2
            : null,
        MSOptOut: cookieTargetingStore.microsoftChoiceCookieOptOutBit == 2,
        SendMuid: cookieTargetingStore.effectiveOptInValue,
        AdsExpFlights: getAdExpFlights().toString(),
        GDPRApplies_2: gdprapplies,
        GDPRPurposes_2: consentStringPurpose.toString(),
        ReadingPanePosition: getUserConfiguration().UserOptions?.GlobalReadingPanePositionReact,
        IsFocusedInboxEnabled: getUserConfiguration().UserOptions?.IsFocusedInboxEnabled,
        NativeAdsSeenRunningSum: adsAggregateOption?.nativeAdsSeenRunningSum ?? 'NoValue',
        NativeAdsClickedRunningSum: adsAggregateOption?.nativeAdsClickedRunningSum ?? 'NoValue',
        NativeCPMRunningSum: adsAggregateOption?.nativeCPMRunningSum ?? 'NoValue',
        WasAdSeenInLastSession: adsAggregateOption?.wasAdSeenInLastSession ?? 'NoValue',
    });

    adUserConfigDataPoint.addCosmosOnlyData(
        JSON.stringify({
            GDPRConsentString_2: gdprConsentDataString,
            LiveRampEnvelopeId: liveRampEnvelopeId,
        })
    );

    adUserConfigDataPoint.end();

    // Always update Ad Last Seen to false at first
    updateWasAdLastSeenInLastSessionLazy.importAndExecute(false);
}
