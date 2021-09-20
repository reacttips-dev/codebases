/**
 * Creates Unicode flag from a two-letter ISO country code.
 * https://stackoverflow.com/questions/24050671/how-to-put-japan-flag-character-in-a-string
 * @param  {string} country — A two-letter ISO country code (case-insensitive).
 * @return {string}
 */
export default function getCountryFlag(country) {
    return getRegionalIndicatorSymbol(country[0]) + getRegionalIndicatorSymbol(country[1]);
}
/**
 * Converts a letter to a Regional Indicator Symbol.
 * @param  {string} letter
 * @return {string}
 */

function getRegionalIndicatorSymbol(letter) {
    return String.fromCodePoint(0x1F1E6 - 65 + letter.toUpperCase().charCodeAt(0));
}
//# sourceMappingURL=unicode.js.map