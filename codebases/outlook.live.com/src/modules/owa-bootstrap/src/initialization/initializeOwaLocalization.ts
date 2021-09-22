import { initializeOwaDateTimeTranslations } from 'owa-datetime-localization';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import { setLocale } from 'owa-localize';
import { cachePreloadUrls } from 'owa-localize-internal';
import { getVariantEnvironment } from 'owa-metatags';
import { getOpxHostApi } from 'owa-opx';
import { getSupportedFallbackForLocale } from 'owa-shared-bootstrap/lib/getSupportedFallbackForLocale';
import { initializeOwaTimeFormatTranslations } from 'owa-timeformat-localization';

// There is a limited number of languages that are deployed in the AGALL environment
const enabledAgallLanguages = ['en'];

export async function initializeOwaLocalization(
    locale: string,
    culture: string,
    dir?: 'ltr' | 'rtl'
): Promise<void> {
    if (isHostAppFeatureEnabled('loadCultureFromHostApp')) {
        const opxHostApi = getOpxHostApi();
        opxHostApi.registerLocalizationChanged(opxLoadLocalization);
        const opxCulture = await opxHostApi.getOpxCulture();
        if (opxCulture) {
            return opxLoadLocalization(opxCulture);
        } else {
            return internalLoadLocalization(locale, culture, dir);
        }
    } else {
        return internalLoadLocalization(locale, culture, dir);
    }
}

function internalLoadLocalization(
    locale: string,
    culture: string,
    dir?: 'ltr' | 'rtl'
): Promise<void> {
    const env = getVariantEnvironment();
    const isAirGap = env == 'AG08' || env == 'AG09';
    if (isAirGap && enabledAgallLanguages.indexOf(locale) == -1) {
        // we default to english if the language is not available
        locale = 'en';
        dir = 'ltr';
    }

    /**
     * Any shared packages that are used in boot should have their
     * localization initialized here. Any shared packages *not* used in boot
     * should have their localization initialized by the LazyModule which loads
     * the shared package
     */
    initializeOwaTimeFormatTranslations();
    initializeOwaDateTimeTranslations();

    if (!dir) {
        dir = getSupportedFallbackForLocale(locale).dir;
    }
    const promise = setLocale(locale, dir, culture);
    cachePreloadUrls();
    return promise;
}

function opxLoadLocalization(culture: string): Promise<void> {
    // apply fallback logic in case host requests an unsupported culture and to determine language direction
    const { locale, dir } = getSupportedFallbackForLocale(culture);
    return internalLoadLocalization(locale, culture, dir);
}
