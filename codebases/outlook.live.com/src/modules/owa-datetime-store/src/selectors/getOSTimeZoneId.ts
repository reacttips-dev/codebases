import getWindowsTimeZoneIdFromIANAId from './getWindowsTimeZoneIdFromIANAId';

/**
 * Get the OS TimeZoneId from the browser Intl API.
 *
 * * @description
 * Note - Unsupported for IE and certain older browser version (E.g., Safari 10)
 * Note - If a user has recently traveled and changed time zones, this may be
 * inaccurate (not up-to-date) for browsers other than Chrome and Chromium-Edge
 */
export default function getOSTimeZoneId(): string | undefined {
    if (window.Intl) {
        const OSIANATimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return getWindowsTimeZoneIdFromIANAId(OSIANATimeZone);
    }

    return undefined;
}
