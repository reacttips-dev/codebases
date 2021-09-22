import { action } from 'satcheljs';

export const acceptTargetedAds = action('ACCEPT_TARGETED_ADS');
export const acceptFirstPartyCookie = action('ACCEPT_FIRSTPARTYCOOKIE');
export const manageAdsOptions = action(
    'MANAGE_ADS_OPTIONS',
    (showGdprPartnerListViewV3: boolean) => ({
        showGdprPartnerListViewV3: showGdprPartnerListViewV3,
    })
);
