import { getStore } from '../store';

export default function getWindowsTimeZoneIdFromIANAId(IANATimeZone: string): string | undefined {
    const { TimeZoneAlternateNames } = getStore();
    let windowsTimeZone: string | undefined = undefined;

    for (const timeZone of TimeZoneAlternateNames.keys()) {
        const IANAAlternativeNames = TimeZoneAlternateNames.get(timeZone);
        if (IANAAlternativeNames?.includes(IANATimeZone)) {
            windowsTimeZone = timeZone;
            break;
        }
    }

    return windowsTimeZone;
}
