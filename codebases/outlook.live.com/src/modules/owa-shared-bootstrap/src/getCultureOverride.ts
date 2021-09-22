import { getQueryStringParameters } from 'owa-querystring';
import { getHostLocation } from 'owa-url/lib/hostLocation';
import { getSupportedFallbackForLocale } from './getSupportedFallbackForLocale';

const CULTURE_QUERYSTRING_PARAMETER_NAME = 'culture';

/** Returns locale value provided via `culture` query parameter */
export function getCultureOverride() {
    const location = getHostLocation();
    let queryOptions = getQueryStringParameters(location);
    let devDefault = process.env.NODE_ENV === 'dev' ? 'qps-ploc' : null;
    const culture = queryOptions[CULTURE_QUERYSTRING_PARAMETER_NAME];
    if (culture) {
        const fallbackLocale = getSupportedFallbackForLocale(
            queryOptions[CULTURE_QUERYSTRING_PARAMETER_NAME]
        );
        if (fallbackLocale?.localeNotFound) {
            return null;
        }
        return fallbackLocale?.locale;
    }
    return devDefault;
}
