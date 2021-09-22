import sjcl from 'js/lib/sjcl';
import 'js/lib/sjcl-sha1';
import 'js/lib/sjcl-codecHex';

/**
 * Given a string, returns a double between 0 and 1.
 * The double is generated using SHA1 hashing.
 */
export default (id: string): number => {
  const digest = sjcl.codec.hex.fromBits(sjcl.hash.sha1.hash(id));
  const hashValue = parseInt(digest.substr(digest.length - 8), 16);
  return hashValue / 2 ** 32;
};
