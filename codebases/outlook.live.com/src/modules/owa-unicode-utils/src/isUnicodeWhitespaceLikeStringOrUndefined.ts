const UNICODE_WHITESPACE_LIKE_CHARACTERS = [
    // Via https://unicode.org/cldr/utility/list-unicodeset.jsp?a=%5b:White_Space=Yes:%5d
    '\u0009', // null
    '\u000A', // null
    '\u000B', // null
    '\u000C', // null
    '\u000D', // null
    '\u0020', // SPACE
    '\u0085', // null
    '\u00A0', // NO-BREAK SPACE
    '\u1680', // OGHAM SPACE MARK
    '\u2000', // EN QUAD
    '\u2001', // EM QUAD
    '\u2002', // EN SPACE
    '\u2003', // EM SPACE
    '\u2004', // THREE-PER-EM SPACE
    '\u2005', // FOUR-PER-EM SPACE
    '\u2006', // SIX-PER-EM SPACE
    '\u2007', // FIGURE SPACE
    '\u2008', // PUNCTUATION SPACE
    '\u2009', // THIN SPACE
    '\u200A', // HAIR SPACE
    '\u2028', // LINE SEPARATOR
    '\u2029', // PARAGRAPH SEPARATOR
    '\u202F', // NARROW NO-BREAK SPACE
    '\u205F', // MEDIUM MATHEMATICAL SPACE
    '\u3000', // IDEOGRAPHIC SPACE
    /// Via http://unicode.org/cldr/utility/list-unicodeset.jsp?a=%5b:subhead=Format%20character:%5d
    '\u061C', // ARABIC LETTER MARK
    '\u200B', // ZERO WIDTH SPACE
    '\u200C', // ZERO WIDTH NON-JOINER
    '\u200D', // ZERO WIDTH JOINER
    '\u200E', // LEFT-TO-RIGHT MARK
    '\u200F', // RIGHT-TO-LEFT MARK
    '\u2028', // LINE SEPARATOR
    '\u2029', // PARAGRAPH SEPARATOR
    '\u202A', // LEFT-TO-RIGHT EMBEDDING
    '\u202B', // RIGHT-TO-LEFT EMBEDDING
    '\u202C', // POP DIRECTIONAL FORMATTING
    '\u202D', // LEFT-TO-RIGHT OVERRIDE
    '\u202E', // RIGHT-TO-LEFT OVERRIDE
    '\u202F', // NARROW NO-BREAK SPACE
    '\u2060', // WORD JOINER
    '\u2066', // LEFT-TO-RIGHT ISOLATE
    '\u2067', // RIGHT-TO-LEFT ISOLATE
    '\u2068', // FIRST STRONG ISOLATE
    '\u2069', // POP DIRECTIONAL ISOLATE
];

let unicodeSpacesSet: null | Set<string> = null;

/**
 * Checks if a string is a whitespace-like character for the purposes of printing.
 *
 * See https://outlookweb.visualstudio.com/Outlook%20Web/_workitems/edit/49996 for details.
 */
export const isUnicodeWhitespaceLikeStringOrUndefined = (inString?: string) => {
    if (!inString) {
        return true;
    }

    // lazy initialize the spaces set
    if (unicodeSpacesSet === null) {
        unicodeSpacesSet = new Set();
        UNICODE_WHITESPACE_LIKE_CHARACTERS.forEach(char => unicodeSpacesSet.add(char));
    }

    const characters = inString.split('');
    return characters.every(char => unicodeSpacesSet.has(char));
};
