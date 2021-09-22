import { localizedFormatter } from './localizedFormatter';

/**
 * Gets a short version of the user's date format, with just day and month.
 */
export function getShortUserDateFormat(dateFormat: string): string {
    const matches = dateFormat.match(/((M+[^M]*d+)|(d+[^d]*M+))(?:.$)?/);
    return matches ? matches[0] : dateFormat;
}

export default localizedFormatter(getShortUserDateFormat);
