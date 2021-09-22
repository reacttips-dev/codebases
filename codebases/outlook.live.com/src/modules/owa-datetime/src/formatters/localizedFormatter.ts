import {
    getLocalizedString,
    OwaDateTimeLocalizedStringResourceId,
} from '../localization/getLocalizedString';
import { computed } from 'mobx';
import { getDateFormat, getTimeFormat } from 'owa-datetime-store';
import type { OwaDate } from '../schema';
import formatDate from './formatDate';

export { format } from 'owa-localize';

/**
 * Signature of functions that produce a Localized Format string.
 */
export type GetLocalizedFormat = (dateFormat: string, timeFormat: string) => string;

/**
 * Creates a specialized `get*Format` function simple localized format specifiers.
 * The resulting function uses a regular expression to extracts a format specifier
 * from the date or time formats and returns the corresponding localized format.
 * For more deatils, see http://aka.ms/owaformatstrings
 */
export function localizedFormat(pattern: RegExp, useTimeFormat?: boolean) {
    return (dateFormat: string, timeFormat: string): string => {
        const format = useTimeFormat ? timeFormat : dateFormat;
        const match = format.match(pattern);
        const formatSpecifier = match ? match[0] : '';
        return (
            getLocalizedString(formatSpecifier as OwaDateTimeLocalizedStringResourceId) ||
            formatSpecifier
        );
    };
}

/**
 * Creates a localized formatting function with a computed localized mask.
 */
export function localizedFormatter(getLocalizedFormat: GetLocalizedFormat) {
    const mask = computed(() => getLocalizedFormat(getDateFormat(), getTimeFormat()));
    return (date: OwaDate) => formatDate(date, mask.get());
}
