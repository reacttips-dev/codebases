import { getOwaResourceUrl } from 'owa-resource-url';

export const allowedCountriesPhoneInput = [
    'au', // Australia
    'br', // Brazil
    'ca', // Canada
    'co', // Columbia
    'fr', // France
    'gb', // UK
    'in', // India
    'it', // Italy
    'jp', // Japan
    'nl', // Netherlands
    'es', // Spain
    'de', // Germany
    'th', // Thailand
    'ie', // Ireland
    'mx', // Mexico
    'pe', // Peru
    'us', // US
];

export const localizedCountriesIntlPhoneInput = {
    es: 'España',
    in: 'India (भारत)',
    br: 'Brasil',
    it: 'Italia',
    jp: 'Japan (日本)',
    nl: 'Nederland',
    th: 'Thailand (ไทย)',
    pe: 'Perú',
};

export const qrCodeImage = getOwaResourceUrl('resources/img/outlook-mobile-qrcode.png');

export const qrCodeImageDark = getOwaResourceUrl('resources/img/outlook-mobile-qrcode-dark.png');

export const outlookMobileApps = getOwaResourceUrl('resources/img/outlook-mobile-apps.png');

export const outlookMobileAppsDarkTheme = getOwaResourceUrl(
    'resources/img/outlook-mobile-apps-dark.png'
);

export const OutlookClientsToUpdate: string[] = ['OWA'];
