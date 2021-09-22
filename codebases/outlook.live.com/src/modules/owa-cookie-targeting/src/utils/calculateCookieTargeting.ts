import * as actions from '../actions/cookieTargetingActions';
import loadLgpdOptInBit from '../services/loadLgpdOptInBit';
import loadUserChoiceOptOutValue from '../services/loadUserChoiceOptOutValue';
import cookieTargetingStore from '../store/cookieTargetingStore';
import { loadFirstPartyCookieFlag } from 'owa-gdpr-ad-tcf';
import { isGdprAdMarket, isLgpdAdFlightEnabled, isLgpdAdMarket } from 'owa-mail-ads-shared';

export async function calculateCookieTargeting(): Promise<void> {
    // Set the default opt-in value as true. For most users who are not in GDPR or LGPD, the user will be opt-out when the user opts out on choice.microsoft.com
    let optInValue = true;

    // For GDPR, gdprFirstPartyCookieOptOutBit
    // 2 means the user has explictly opt-in
    // 3 means the user has explictly opt-out
    if (isGdprAdMarket()) {
        if (cookieTargetingStore.gdprFirstPartyCookieOptInBit != 0) {
            optInValue = cookieTargetingStore.gdprFirstPartyCookieOptInBit == 2;
        } else {
            const firstPartyCookieFlagValue = await loadFirstPartyCookieFlag();
            optInValue = firstPartyCookieFlagValue == 2;
            actions.setGdprFirstPartyCookieOptInBit(firstPartyCookieFlagValue);
        }
    }

    // For Brazil users will be allowed to sent the bit only when they opted-in the LGPD ads consents
    // 2 means user has explictly opt-in
    // 1 means user has explictly opt-out
    if (isLgpdAdFlightEnabled() && isLgpdAdMarket()) {
        if (cookieTargetingStore.lgpdOptInBit != 0) {
            optInValue = cookieTargetingStore.lgpdOptInBit == 2;
        } else {
            const lgpdOptInBitValue = await loadLgpdOptInBit();
            optInValue = lgpdOptInBitValue == 2;
            actions.setLgpdOptInBit(lgpdOptInBitValue);
        }
    }

    // For Microsoft choice option, loadUserChoiceOptOutValue true means user has opt-out while false means user has opt-in
    // microsoftChoiceCookieOptOutBit 2 means user has opt-out while 1 means user has opt-in
    let userMicrosoftChoiceOptOutValue;
    if (cookieTargetingStore.microsoftChoiceCookieOptOutBit != 0) {
        userMicrosoftChoiceOptOutValue = cookieTargetingStore.microsoftChoiceCookieOptOutBit == 2;
    } else {
        userMicrosoftChoiceOptOutValue = await loadUserChoiceOptOutValue();
        let userMicrosoftChoiceOptOutBit = userMicrosoftChoiceOptOutValue ? 2 : 1;
        actions.setMicrosoftChoiceUserOptOutBit(userMicrosoftChoiceOptOutBit);
    }

    optInValue = optInValue && !userMicrosoftChoiceOptOutValue;
    actions.setTargetingOptInValue(optInValue);
    return Promise.resolve();
}
