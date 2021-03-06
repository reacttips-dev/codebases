// This file is a version of core/codecString.js, taken from
// git://github.com/bitwiseshiftleft/sjcl.git, downloaded 2013/04/11.
// Modified 2016/07/05 to get rid of dependency on `window`
import sjcl from 'js/lib/sjcl';

import 'js/lib/sjcl-bitArray';

const addCodecString = function(sjcl) {
  /** @fileOverview Bit array codec implementations.
   *
   * @author Emily Stark
   * @author Mike Hamburg
   * @author Dan Boneh
   */

  /** @namespace UTF-8 strings */
  sjcl.codec.utf8String = {
    /** Convert from a bitArray to a UTF-8 string. */
    fromBits(arr) {
      let out = '',
        bl = sjcl.bitArray.bitLength(arr),
        i,
        tmp;
      for (i = 0; i < bl / 8; i++) {
        if ((i & 3) === 0) {
          tmp = arr[i / 4];
        }
        out += String.fromCharCode(tmp >>> 24);
        tmp <<= 8;
      }
      return decodeURIComponent(escape(out));
    },

    /** Convert from a UTF-8 string to a bitArray. */
    toBits(str) {
      str = unescape(encodeURIComponent(str));
      let out = [],
        i,
        tmp = 0;
      for (i = 0; i < str.length; i++) {
        tmp = (tmp << 8) | str.charCodeAt(i);
        if ((i & 3) === 3) {
          out.push(tmp);
          tmp = 0;
        }
      }
      if (i & 3) {
        out.push(sjcl.bitArray.partial(8 * (i & 3), tmp));
      }
      return out;
    },
  };
};

addCodecString(sjcl);
