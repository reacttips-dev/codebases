import { setLocale, addLocstringsToStore } from 'owa-localize';
import { getSupportedFallbackForLocale } from 'owa-shared-bootstrap/lib/getSupportedFallbackForLocale';

export var userLocale: string;

export var userIdentity: string;

export var prefetchedStrings: Record<string, string>;

export var needInitialization: boolean;

export function initializeStrings(): void {
    let locale = 'en';

    if (userLocale) {
        locale = userLocale;
    }

    const stringLanguage = getSupportedFallbackForLocale(locale);
    setLocale(stringLanguage.locale, stringLanguage.dir).then(() => {
        if (prefetchedStrings) {
            addLocstringsToStore(prefetchedStrings);
        }
    });
}

export function registerStrings(prefetchedStringsValue: Record<string, string>) {
    prefetchedStrings = prefetchedStringsValue;
}

export function initializeUserSettings(userSmtpAddressValue: string, userLocaleValue: string) {
    userLocale = userLocaleValue;
    userIdentity = userSmtpAddressValue;
}

export function getUserSmtp() {
    return userIdentity;
}
