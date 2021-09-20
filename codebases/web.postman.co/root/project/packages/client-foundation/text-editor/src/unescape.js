/**
 * Earlier we used to parse the response body in pretty view using bigJSON.parse followed by bigJSON.stringify.
 * These functions take the entire response at once and then process it. This could be a problem as the response
 * size increases. Also, this way we are limited to being able to process the response only when we have the whole
 * of it.
 * Now, we are unescaping the escape characters in the response body manually so as to replicate the
 * same behaviour. We process the response as a string and so we can handle parts of it as and when they
 * arrive.
 *
 * Considering only those escape sequences that are valid json strings as mentioned
 * here - https://github.com/v8/v8/blob/a0c3797461810e3159662851e64946e17654236e/src/json/json-parser.h#L256
 *
 * It says -
 *  A JSON string (production JSONString) is subset of valid JavaScript string literals. The string
 *  must only be double-quoted (not single-quoted), and the only allowed backslash-escapes
 *  are ", /, \, b, f, n, r, t and four-digit hex escapes (uXXXX). Any other use of backslashes is invalid.
 *
 * The following patterns are taken into consideration -
 *
 * \\ - matches the backslash which indicates the beginning of an escape sequence
 * (
 *   u([0-9A-Fa-f]{4}) - first alternative; matches the 4-digit hexadecimal escape sequence (\uABCD)
 * |
 *   (\/) - second alternative; matches the forward slash (\/) escape sequence
 * )
 *
 * The following cases are handled -
 *
 *  1. Normal unicode characters (Ex - \\u00AB) are converted to the respective character
 *
 *  2. Forward slash escape sequence \\\/ (string for escape sequence \/) is changed to \/ (string for the character /)
 *
 *  3. Special characters (\n, \v, \b, \n, \r, \t) are not parsed and rendered as the escape sequence itself
 *     (If they are parsed, they may break formatting for the JSON)
 *
 *  4. Unicodes for the following characters are converted as follows instead of the actual character -
 *     (If they are converted to the respective character, they break formatting for the JSON)
 *         '\\u0008': '\\b',
 *         '\\u0009': '\\t',
 *         '\\u000a': '\\n',
 *         '\\u000b': '\\u000b',
 *         '\\u000c': '\\f',
 *         '\\u000d': '\\r',
 *         '\\u0022': '\\"'
 *     These conversions are done in accordance with how JSON.stringify handles these unicode characters.
 *     The same can be found in the source code for JSON.stringify -
 *     https://github.com/v8/v8/blob/a0c3797461810e3159662851e64946e17654236e/src/json/json-stringifier.cc#L147
 *
 *  5. Even though backslashes are parsed by JSON.parse() and changed from \\\\ (string for escape sequence \\)
 *     to \\ (string for the character \), we follow it by using JSON.stringify which changes \\ to \\\\
 *     again. So, we don't handle backslash here.
 *
 *  6. Surrogate pairs (A pair of unicode characters representing a single character. Ex - the surrogate pair \\uD834\\uDD1E
 *     defines the character represented by \\u{1D11E})
 */

 const jsEscapeRegex = /\\u([0-9A-Fa-f]{4})|\\(\/)/g;

 /**
  * Returns the character from a string representing the hexadecimal codepoint.
  *
  * @param {String} str
  *
  * @returns {String}
  */
 function fromHex (str) {
   return String.fromCodePoint(parseInt(str, 16));
 }

 /**
  * Handles escaping for forward slash(/) and backslash(\) characters
  */
 const slashMap = {
   '\/': '\/'
 };

 /**
  * Converts unicode for special characters - \b, \t, \n, \f, \r, \" to their string representations
  * Also, returns the unicode itself for the case of \v (\u000b)
  *
  * Cases for both uppercase and lowercase are added so that there is no need to convert the sequence to lowercase
  * before referring to the map. Converting each sequence to lowercase may lead to bad performance for
  * responses having a large number of escape sequences. This is because we would be calling the function
  * for each and every character in the response even if it is not there in the map. Also, calling toLowerCase()
  * for sequences that are already lowercase would be redundant.
  */
 const unicodeToEscapeMap = {
   '\\u0008': '\\b',
   '\\u0009': '\\t',
   '\\u000a': '\\n',
   '\\u000b': '\\u000b',
   '\\u000c': '\\f',
   '\\u000d': '\\r',
   '\\u000A': '\\n',
   '\\u000B': '\\u000b',
   '\\u000C': '\\f',
   '\\u000D': '\\r',
   '\\u0022': '\\"'
 };

 /**
  * Unescapes the character sequences converting the escaped unicode code points to actual
  * unicode character.
  *
  * @export
  * @param {String} string
  *
  * @returns {String}
  */
 export function unescape (inputString) {
   if (!inputString) { return ''; }

   return inputString.replace(jsEscapeRegex, (matchedPattern, longHex, slash) => {
     if (longHex) {
       return unicodeToEscapeMap[matchedPattern] || fromHex(longHex);
     } else if (slash) {
       return slashMap[slash];
     }
   });
 }
