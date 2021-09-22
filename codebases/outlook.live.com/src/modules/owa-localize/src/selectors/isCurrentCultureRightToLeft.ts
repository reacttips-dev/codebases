import { getRTL } from '@fluentui/react/lib/Utilities';

/**
 * Look up whether language (locale) used to localize UX content for the user is RTL-based
 *
 * This is agnostic of backing storage or config, which can vary by runtime context (e.g. OWA, OPX, etc)
 */
export function isCurrentCultureRightToLeft() {
    return getRTL();
}
