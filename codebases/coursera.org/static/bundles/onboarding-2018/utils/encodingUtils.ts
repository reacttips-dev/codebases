import * as base64 from 'vendor/cnpm/base-64.v0-1-0/base64';
import * as utf8 from 'vendor/cnpm/utf8.v2-1-2/utf8';

// TODO: Encoding to a shorter string (compared to casting) will add more variance in encoding and less susceptibility
// to workarounds.
const numberToShortString = (num: number): string => {
  return num.toString();
};

// Bit-wise XOR for two strings, not necessarily of the same length.
const xor = (in1: string, in2: string): string => {
  let idx = 0;
  let i = 0;
  let j = 0;
  const longest = Math.max(in1.length, in2.length);
  const res = [];
  while (idx < longest) {
    // @ts-ignore TSMIGRATION
    res.push(String.fromCharCode(in1.charCodeAt(i) ^ in2.charCodeAt(j))); // eslint-disable-line no-bitwise
    idx += 1;
    i = (i + 1) % in1.length;
    j = (j + 1) % in2.length;
  }
  return res.join('');
};

// Encodes a plain string in a URL-friendly manner (base64 for now) for a given key. Only this key can decode it.
// That said, this is not an encryption mechanism, albeit actually complex to "decode" without the key.
// The use of XOR allows us to not actually encrypt; encryption is an expensive operation and would yield more output.
const encodeToUrlWithNumericKey = (plain: string, key: number): string =>
  base64.encode(xor(utf8.encode(plain), numberToShortString(key)));

const decodeFromUrlWithNumericKey = (encoded: string, key: number): string =>
  utf8.decode(xor(base64.decode(encoded), numberToShortString(key)));

export default {
  encodeToUrlWithNumericKey,
  decodeFromUrlWithNumericKey,
};

export { encodeToUrlWithNumericKey, decodeFromUrlWithNumericKey };
