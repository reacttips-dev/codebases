import { action, mutatorAction } from 'satcheljs';
import { getLocalizedStringStore } from '../store/store';
import { fetchLocstringFile } from './fetchLocstringFile';
import { isGulpingValue } from 'owa-querystring';
import { setRTL } from '@fluentui/utilities';

export function setLocale(locale: string, dir: 'ltr' | 'rtl', culture?: string): Promise<void> {
    // Normalize locale
    locale = locale.toLowerCase();

    if (getLocalizedStringStore().currentLocale !== locale) {
        if (!isGulpingValue) {
            window._locStrings.unregisterHandler(getLocalizedStringStore().currentLocale, url =>
                fetchLocstringFile(locale, url)
            );
        }
        changeLocaleInStore(locale, culture);

        document.dir = dir;
        setRTL(dir === 'rtl', true); // Ensure ui fabric has up to date RTL

        onLocaleChanged(locale);
        if (!isGulpingValue) {
            return window._locStrings.registerHandler(locale, url =>
                fetchLocstringFile(locale, url)
            );
        }
    }
    return Promise.resolve();
}

export const onLocaleChanged = action('ON_LOCALE_CHANGED', (locale: string) => ({ locale }));

const changeLocaleInStore = mutatorAction(
    'MUTATE_LOCSTRING_LOCALE',
    (locale: string, culture?: string) => {
        getLocalizedStringStore().currentLocale = locale;

        if (culture) {
            getLocalizedStringStore().currentCulture = culture;
        }
    }
);
