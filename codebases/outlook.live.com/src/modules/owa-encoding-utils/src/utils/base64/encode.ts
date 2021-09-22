import { BASE64_KEY_STRING } from './constants';

/**
 * Encodes the specified input binary string into a base64-encoded string
 * @param input binary string input
 * @returns a base64 encoded string
 */
export default function encode(input: string): string {
    if (!input) {
        return input;
    }

    try {
        return btoa(input);
    } catch (e) {
        // Browser's built in base64 encoder didn't work, use our custom one that supports unicode
    }

    let output = '';
    let i = 0;

    const inputBytes = stringToByteArray(input);

    while (i < inputBytes.length) {
        const chr1 = inputBytes.charCodeAt(i++);
        const chr2 = i < inputBytes.length ? inputBytes.charCodeAt(i++) : 0;
        const chr3 = i < inputBytes.length ? inputBytes.charCodeAt(i++) : 0;

        // first six bits of the first character
        const encoding1 = chr1 >> 2;

        // last two bits of the first character and first four of the second
        const encoding2 = ((chr1 & 3) << 4) | (chr2 >> 4);

        // last four of the second and first two of the third
        let encoding3 = ((chr2 & 15) << 2) | (chr3 >> 6);

        // last six of the third character
        let encoding4 = chr3 & 63;

        if (i == inputBytes.length) {
            if (inputBytes.length % 3 == 1) {
                encoding3 = 64;
                encoding4 = 64;
            } else if (inputBytes.length % 3 == 2) {
                encoding4 = 64;
            }
        }

        output +=
            BASE64_KEY_STRING.charAt(encoding1) +
            BASE64_KEY_STRING.charAt(encoding2) +
            BASE64_KEY_STRING.charAt(encoding3) +
            BASE64_KEY_STRING.charAt(encoding4);
    }
    return output;
}

/**
 * Converts string to byte array
 */
function stringToByteArray(input: string): string {
    let result: string = '';
    for (let i = 0; i < input.length; i++) {
        let charCode = input.charCodeAt(i);
        let charResult = [];
        do {
            charResult.push(charCode & 0xff); // push byte to "stack"
            charCode >>= 8; // shift 1 byte down
        } while (charCode);

        // Append to result in reverse order
        for (let j = charResult.length - 1; j > -1; j--) {
            result += String.fromCharCode(charResult[j]);
        }
    }
    return result;
}
