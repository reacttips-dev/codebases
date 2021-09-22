import getDisplayDateParserConfig from './getDisplayDateParserConfig';
import type { OwaDate } from '../schema';
import { getDisplayDateParserRegExp } from './getDisplayDateParserRegExp';
import { parseDisplayDate } from './parseDisplayDate';
import { getTimeFormat } from 'owa-datetime-store';

/**
 * Parse a display date based on the user's selected time format.
 */
export default function parseUserDate(value: string, referenceDate?: OwaDate): OwaDate {
    const config = getDisplayDateParserConfig();
    const regexp = getDisplayDateParserRegExp(getTimeFormat());
    return parseDisplayDate(value, regexp, config, referenceDate);
}
