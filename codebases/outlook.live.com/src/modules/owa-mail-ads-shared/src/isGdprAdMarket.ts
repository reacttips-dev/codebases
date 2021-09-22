import { getAdMarketPublishGroupCode, getMarketCountryCode } from './sharedAdsUtils';

// Country codes:
// https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
//
// EU member countries:
// https://europa.eu/european-union/about-eu/countries_en
//
// EEA Member Countries:
// https://www.gov.uk/eu-eea
// Iceland, Liechtenstein, Norway, Switzerland
const gdprMarkets = [
    'AT', // Austria
    'BE', // Belgium
    'BG', // Bulgaria
    'CH', // Switzerland (EEA)
    'CY', // Cyprus
    'CZ', // Czechia
    'DE', // Germany
    'DK', // Denmark
    'EE', // Estonia
    'ES', // Spain
    'FI', // Finland
    'FR', // France
    'GB', // United Kingdom
    'GR', // Greece
    'HR', // Croatia
    'HU', // Hungary
    'IE', // Ireland
    'IS', // Iceland (EEA)
    'IT', // Italy
    'LI', // Liechtenstein (EEA)
    'LT', // Lithuania
    'LU', // Luxembourg
    'LV', // Latvia
    'MT', // Malta
    'NL', // Netherlands
    'NO', // Norway (EEA)
    'PL', // Poland
    'PT', // Portugal
    'RO', // Romania
    'SE', // Sweden
    'SI', // Slovenia
    'SK', // Slovakia
];

export default function isGdprAdMarket() {
    const countryCode = getMarketCountryCode(getAdMarketPublishGroupCode());
    return gdprMarkets.indexOf(countryCode) >= 0;
}
