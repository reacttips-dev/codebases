const AMPERSAND_REGEX = new RegExp('&', 'g');
const APOSTROPHE_REGEX = new RegExp("'", 'g');
const ENCODED_AMPERSAND = '&amp;';
const ENCODED_APOSTROPHE = '&#39;';
const ENCODED_GREATER_THAN = '&gt;';
const ENCODED_LESS_THAN = '&lt;';
const ENCODED_QUOTATION = '&quot;';
const GREATER_THAN_REGEX = new RegExp('>', 'g');
const LESS_THAN_REGEX = new RegExp('<', 'g');
const QUOTATION_REGEX = new RegExp('"', 'g');

export default function encode(rawHtml: string): string {
    if (!rawHtml || rawHtml.length == 0) {
        return rawHtml;
    }

    let encodedHtml = rawHtml.replace(AMPERSAND_REGEX, ENCODED_AMPERSAND);
    encodedHtml = encodedHtml.replace(LESS_THAN_REGEX, ENCODED_LESS_THAN);
    encodedHtml = encodedHtml.replace(GREATER_THAN_REGEX, ENCODED_GREATER_THAN);
    encodedHtml = encodedHtml.replace(APOSTROPHE_REGEX, ENCODED_APOSTROPHE);
    encodedHtml = encodedHtml.replace(QUOTATION_REGEX, ENCODED_QUOTATION);
    return encodedHtml;
}
