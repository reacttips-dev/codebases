const displayNameParenRegex = /^"?(.*?)"?\s*\(([^\(]*?)\)$/;
const displayNameAngleBracketRegex = /^"?(.*?)"?\s*<([^<]*?)>$/;
const displayNameSquareBracketRegex = /^"?(.*?)"?\s*\[([^\[]*?)\]$/;
const displayNameCurlyBraceRegex = /^"?(.*?)"?\s*{([^\{]*?)}$/;

/**
 * Splits a possible display name + address combination into an address string.
 * Expects display / address strings to be in format "Display Name <address>"
 *
 * @param parseString the input string to parse
 */
export default function getDisplayNameAndAddressFromRecipientString(
    parseString: string
): {
    address: string;
    displayName?: string;
} {
    if (typeof parseString !== 'string') {
        return parseString;
    }

    const inputString = parseString.trim();

    const result =
        inputString.match(displayNameParenRegex) ||
        inputString.match(displayNameAngleBracketRegex) ||
        inputString.match(displayNameSquareBracketRegex) ||
        inputString.match(displayNameCurlyBraceRegex);

    return result
        ? result[1].length
            ? {
                  displayName: result[1],
                  address: result[2],
              }
            : {
                  address: result[2],
              }
        : {
              address: inputString,
          };
}
