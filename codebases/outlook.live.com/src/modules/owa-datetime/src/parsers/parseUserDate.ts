import getDisplayDateParserConfig from './getDisplayDateParserConfig';
import type { OwaDate } from '../schema';
import { getDisplayDateParserRegExp } from './getDisplayDateParserRegExp';
import { parseDisplayDate } from './parseDisplayDate';
import { getDateFormat } from 'owa-datetime-store';

/**
 * Parse a display date based on the user's selected date format.
 */
export default function parseUserDate(
    value: string,
    referenceDate?: OwaDate | null | undefined
): OwaDate | null {
    const config = getDisplayDateParserConfig();
    const regexp = getDisplayDateParserRegExp(getDateFormat());
    return parseDisplayDate(value, regexp, config, referenceDate);
}
