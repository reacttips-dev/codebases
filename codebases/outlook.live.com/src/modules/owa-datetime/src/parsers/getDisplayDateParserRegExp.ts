import type { CaptureGroup, DisplayDateParserRegExp } from './DisplayDateParserRegExp';

/**
 * Gets a regular expression and the corresponding capturing groups
 * capable of parsing dates formatted with the given OWA format string.
 *
 * The expression is not 100% rigid and this is by design, so the user has some flexibility.
 * For example, while the format might ask for 12-hour, the user can still
 * enter a 24-hour value, AM/PM indicators are not mandatory, spaces can
 * be omitted and month names can be full, abbreviated and are case-insensitive.
 */
export function getDisplayDateParserRegExp(owaFormatString: string): DisplayDateParserRegExp {
    const regexp = ['^'];
    const groups: CaptureGroup[] = [];

    // Split the format string into multiple tokens
    // The tokens are: quoted strings, format specifiers, and groups of other characters.
    const tokenRegExp = /'[^']+'|dd|d|MMMM|MMM|MM|M|yyyy|yy|hh|h|HH|H|mm|m|ss|s|tt|t|[^\'dMyhHmst]+/g;
    const tokens = owaFormatString.match(tokenRegExp);

    // Convert each token to a corresponding regular expression.
    // Format specifiers yield capturing groups as well.
    // Quoted strings and the other characters do not yield capturing groups.
    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        switch (token) {
            case 'd':
            case 'dd':
            case 'M':
            case 'MM':
            case 'H':
            case 'HH':
            case 'h':
            case 'hh':
            case 'm':
            case 'mm':
            case 's':
            case 'ss':
                groups.push(<CaptureGroup>token[0]);
                regexp.push('(\\d\\d?)');
                break;
            case 'MMM':
            case 'MMMM':
                groups.push('n');
                regexp.push('([^\\s\\d]+)');
                break;
            case 't':
            case 'tt':
                groups.push('t');
                regexp.push('([^\\s\\d]*)');
                break;
            case 'yy':
            case 'yyyy':
                groups.push('y');
                regexp.push('(-?\\d{1,4})');
                break;
            default:
                // Remove quotes from quoted strings.
                if (token[0] == "'") {
                    token = token.substr(1, token.length - 2);
                }

                // Escape regular expression characters in the token.
                // OWA only uses the dot, so we escape just that.
                regexp.push(token.replace('.', '\\.'));
                break;
        }
    }

    regexp.push('$');
    const value = <DisplayDateParserRegExp>new RegExp(regexp.join('').replace(/\s+/g, '\\s*'));
    value.captureGroups = groups;

    return value;
}
