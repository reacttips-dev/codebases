import { BASE64_KEY_STRING } from './constants';

/**
 * Decodes the specified base64-encoded input
 * @param input base64-encoded input
 * @returns a binary string
 */
export default function decode(input: string): string {
    if (!input) {
        return input;
    }
    const firstCharCode = input.toLowerCase().charCodeAt(0);
    if (
        firstCharCode >= 97 &&
        firstCharCode <= 122 &&
        input.indexOf('#') === -1 &&
        input.indexOf('-') === -1
    ) {
        try {
            return atob(input);
        } catch (e) {
            // Browser's built in base64 decoder didn't work, use our custom one
        }
    }

    let output = '';
    let i = 0;

    // The function to get next char skipping \r and \n
    // We remove these characters because some base64 encoders inserts \r\n to the output string every 76 characters.
    // Per this article http://en.wikipedia.org/wiki/Base64, \r\n is used as a line separator for MIME (RFC 2045), standard base64 (RFC 3548 & 4648).
    const next = () => {
        const chr = input.charAt(i++);
        switch (chr) {
            case '\r':
            case '\n':
                return next();
            default:
                return chr;
        }
    };

    while (i < input.length) {
        const encoding1 = BASE64_KEY_STRING.indexOf(next());
        const encoding2 = BASE64_KEY_STRING.indexOf(next());
        const encoding3 = BASE64_KEY_STRING.indexOf(next());
        const encoding4 = BASE64_KEY_STRING.indexOf(next());

        const chr1 = (encoding1 << 2) | (encoding2 >> 4);
        const chr2 = ((encoding2 & 15) << 4) | (encoding3 >> 2);
        const chr3 = ((encoding3 & 3) << 6) | encoding4;

        output += String.fromCharCode(chr1);

        if (encoding3 != 64) {
            output += String.fromCharCode(chr2);
        }

        if (encoding4 != 64) {
            output += String.fromCharCode(chr3);
        }
    }
    return output;
}
