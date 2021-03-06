/** @fileOverview Javascript cryptography implementation.
*
* Crush to remove comments, shorten variable names and
* generally reduce transmission size.
*
* @author Emily Stark
* @author Mike Hamburg
* @author Dan Boneh
*/
"use strict";

/** @namespace The Stanford Javascript Crypto Library, top-level namespace. */
export default {

  /** @namespace Symmetric ciphers. */
  cipher: {},

  /** @namespace Hash functions.  Right now only SHA256 is implemented. */
  hash: {},

  /** @namespace Key exchange functions.  Right now only SRP is implemented. */
  keyexchange: {},

  /** @namespace Block cipher modes of operation. */
  mode: {},

  /** @namespace Miscellaneous.  HMAC and PBKDF2. */
  misc: {},

  /**
  * @namespace Bit array encoders and decoders.
  *
  * @description
  * The members of this namespace are functions which translate between
  * SJCL's bitArrays and other objects (usually strings).  Because it
  * isn't always clear which direction is encoding and which is decoding,
  * the method names are "fromBits" and "toBits".
  */
  codec: {},

  /** @namespace Exceptions. */
  exception: {
    /** @constructor Ciphertext is corrupt. */
    corrupt: function(message) {
      this.toString = function() { return "CORRUPT: "+this.message; };
      this.message = message;
    },

    /** @constructor Invalid parameter. */
    invalid: function(message) {
      this.toString = function() { return "INVALID: "+this.message; };
      this.message = message;
    },

    /** @constructor Bug or missing feature in SJCL. @constructor */
    bug: function(message) {
      this.toString = function() { return "BUG: "+this.message; };
      this.message = message;
    },

    /** @constructor Something isn't ready. */
    notReady: function(message) {
      this.toString = function() { return "NOT READY: "+this.message; };
      this.message = message;
    }
  }
};
