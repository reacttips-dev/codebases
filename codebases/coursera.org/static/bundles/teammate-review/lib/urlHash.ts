// Simple url-friendly number to hash encode/decode functions. Designed to avoid exposing user id in urls like this:
// https://www.coursera.org/learn/tmr-test2/teammate-review/P4tHD/test-tmr-item/review/27058573
// Becomes:
// https://www.coursera.org/learn/tmr-test2/teammate-review/P4tHD/test-tmr-item/review/g3yj1
// Absolutely not secure, and not designed for security.

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
const alphabetLength = alphabet.length;

export const urlHashEncode = (input: number): string => {
  let i = input;
  let result = '';

  do {
    result = alphabet[i % alphabetLength] + result;
    // @ts-expect-error TSMIGRATION
    i = parseInt(i / alphabetLength, 10);
  } while (i);

  return result;
};

export const urlHashDecode = (input: string): number =>
  input.split('').reduce((result, char) => alphabet.indexOf(char) + result * alphabetLength, 0);
