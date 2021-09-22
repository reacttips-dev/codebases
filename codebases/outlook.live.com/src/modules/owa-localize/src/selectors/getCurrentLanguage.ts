import { getLocalizedStringStore } from '../store/store';

/**
 * Look up current language (locale) used to localize UX content for the user
 *
 * This is agnostic of backing storage or config, which can vary by runtime context (e.g. OWA, OPX, etc)
 */
export function getCurrentLanguage() {
    return getLocalizedStringStore().currentLocale;
}
