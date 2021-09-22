import { getAdMarketPublishGroupCode, getMarketCountryCode } from './sharedAdsUtils';

// See https://gdpr.eu/gdpr-vs-lgpd/ or https://iapp.org/news/a/an-overview-of-brazils-lgpd/
const lgpdAdMarkets = [
    'BR', // Brazil
];

export default function isLgpdAdMarket() {
    const countryCode = getMarketCountryCode(getAdMarketPublishGroupCode());
    return lgpdAdMarkets.indexOf(countryCode) >= 0;
}
