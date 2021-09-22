// This file is a version of core/codecHex.js, taken from
// git://github.com/bitwiseshiftleft/sjcl.git, downloaded 2013/04/11.
// Modified 2016/07/05 to get rid of dependency on `window`
import sjcl from 'js/lib/sjcl';

const addCodecHex = function(sjcl) {
  /** @fileOverview Bit array codec implementations.
   *
   * @author Emily Stark
   * @author Mike Hamburg
   * @author Dan Boneh
   */

  /** @namespace Hexadecimal */
  sjcl.codec.hex = {
    /** Convert from a bitArray to a hex string. */
    fromBits(arr) {
      let i,
        out = '',
        x;
      for (i = 0; i < arr.length; i++) {
        out += ((arr[i] | 0) + 0xf00000000000).toString(16).substr(4);
      }
      return out.substr(0, sjcl.bitArray.bitLength(arr) / 4); // .replace(/(.{8})/g, "$1 ");
    },
    /** Convert from a hex string to a bitArray. */
    toBits(str) {
      let i,
        out = [],
        len;
      str = str.replace(/\s|0x/g, '');
      len = str.length;
      str += '00000000';
      for (i = 0; i < str.length; i += 8) {
        out.push(parseInt(str.substr(i, 8), 16) ^ 0);
      }
      return sjcl.bitArray.clamp(out, len * 4);
    },
  };
};

addCodecHex(sjcl);
