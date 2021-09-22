import { getLocalizedStringStore } from '../store/store';

/**
 * Look up current culture of the user (which OWA may or may not support as a locale/language)
 *
 * This is agnostic of backing storage or config, which can vary by runtime context (e.g. OWA, OPX, etc)
 */
export function getCurrentCulture() {
    return getLocalizedStringStore().currentCulture;
}
