import type InternetHeaders from './InternetHeaders';

const MINIMUM_VALID_ASCII_CHARACTER = 32;
const MAXIMUM_VALID_ASCII_CHARACTER = 126;

export function isValidInternetHeaderKeysArray(keys: (string | null)[]): boolean {
    if (!keys) {
        return false;
    }

    for (const key of keys) {
        if (key == null || key.trim().length === 0) {
            return false;
        }

        let charIndex = key.length;
        while (charIndex--) {
            // A header key must be composed of printable US-ASCII characters
            if (
                key.charCodeAt(charIndex) > MAXIMUM_VALID_ASCII_CHARACTER ||
                key.charCodeAt(charIndex) < MINIMUM_VALID_ASCII_CHARACTER
            ) {
                return false;
            }
        }
    }

    return true;
}

export function internetHeaderDictionaryIsValid(dictionary: InternetHeaders): boolean {
    if (!dictionary) {
        return false;
    }

    return isValidInternetHeaderKeysArray(Object.keys(dictionary));
}
