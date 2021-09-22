import { acceptFirstPartyCookie } from '../actions/internalActions';
import { TCModel, TCString } from '@iabtcf/core';
import { isFeatureEnabled } from 'owa-feature-flags';
import { loadFirstPartyCookieFlag, loadGdprTcfTCString } from 'owa-gdpr-ad-tcf';
import { areAdsEnabled } from 'owa-mail-ads-checker';
import { isGdprAdMarket } from 'owa-mail-ads-shared';

export default async function shouldPrompt() {
    if (
        !areAdsEnabled() || // We only need to prompt if this user receives ads
        !isGdprAdMarket() // GDPR only applies to EU
    ) {
        return false;
    }

    let tcfTCString = await loadGdprTcfTCString();

    if (tcfTCString == null || tcfTCString == '') {
        return true;
    }

    // We will validate the saved TC String is a valid one by checking the cmpid
    // If the saved TC string has the valid cmpid, we will not prompt the dialog. Otherwise, we will prompt the dialog box.
    // For any invalid string, we will prompt the dialog box for the user
    let savedTcModel: TCModel;
    try {
        savedTcModel = TCString.decode(tcfTCString);
    } catch (err) {
        return true;
    }

    let shouldPrompt: boolean;
    if (savedTcModel.cmpId == 168) {
        let firstPartyCookieFlag = await loadFirstPartyCookieFlag();

        // Test hook to simulate the situation the cookie flag is never set
        if (isFeatureEnabled('fwk-gdprAds-TestSkipFirstCookieCheck')) {
            firstPartyCookieFlag = -1;
        }

        // Check if the first parth cookie flag was manually set by the user already
        if (firstPartyCookieFlag == -1) {
            // If the user is full consent, do not prompt
            // If the user has not selected full consent, prompt
            const userSelectAllConsents = savedTcModel?.purposeConsents?.size == 10;
            if (!userSelectAllConsents) {
                return true;
            } else {
                // trigger a silent save as true
                acceptFirstPartyCookie();
            }
        }

        // fwk-gdprAds-TestSkipTcfCheck os a test flight to force the prompt for the testing-purpose only
        // This is safer than a query string
        const skipConsentStringCheck = isFeatureEnabled('fwk-gdprAds-TestSkipTcfCheck');
        shouldPrompt = skipConsentStringCheck;
    } else {
        shouldPrompt = true;
    }

    return shouldPrompt;
}
