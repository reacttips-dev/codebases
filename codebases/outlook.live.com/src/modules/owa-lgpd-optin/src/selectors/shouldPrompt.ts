import loadLgpdOptInBit from '../services/loadlgpdOptInBit';
import { isFeatureEnabled } from 'owa-feature-flags';
import { areAdsEnabled } from 'owa-mail-ads-checker';
import { isLgpdAdFlightEnabled, isLgpdAdMarket } from 'owa-mail-ads-shared';

export default async function shouldPrompt() {
    if (
        !isLgpdAdFlightEnabled() || //Feature is not enabled
        !areAdsEnabled() || // We only need to prompt if this user receives ads
        !isLgpdAdMarket() // LGPD only applies to BR
    ) {
        return false;
    }

    let currentOptInBit = await loadLgpdOptInBit();

    if (currentOptInBit == 0) {
        return true;
    }

    const skipOptInCheck = isFeatureEnabled('fwk-lgdpAds-TestSkipOptInCheck');

    return skipOptInCheck;
}
