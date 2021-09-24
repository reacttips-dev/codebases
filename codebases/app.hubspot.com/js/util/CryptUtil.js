'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import Raven from 'Raven';
import Blowfish from './egoroof-blowfish/Blowfish';
import { base64ToBytes } from './EncodingUtil';

var CryptUtil = /*#__PURE__*/function () {
  function CryptUtil(key) {
    var _this = this;

    _classCallCheck(this, CryptUtil);

    this.decrypt = function (encrypted) {
      return _this.blowfish.decode(base64ToBytes(encrypted));
    };

    this.blowfish = new Blowfish(base64ToBytes(key), Blowfish.MODE.CBC, Blowfish.PADDING.PKCS5);
    this.blowfish.setIv('12345678');
  }

  _createClass(CryptUtil, [{
    key: "decryptToJSON",
    value: function decryptToJSON(encrypted) {
      var decrypted = this.decrypt(encrypted);
      var object;

      try {
        object = JSON.parse(CryptUtil.sanitizeJSON(decrypted));
      } catch (error) {
        Raven.captureException('Decryption failed', {
          extra: {
            error: error
          }
        });
      }

      if (typeof object !== 'object') {
        throw new Error('Decrypted is not an object');
      }

      return object;
    }
  }], [{
    key: "splitEncryptedToken",
    value: function splitEncryptedToken(token) {
      var results = token.split(':');
      var timestampIndex = results.length - 1;
      return {
        encrypted: results.slice(0, timestampIndex).join(':'),
        timestamp: parseInt(results[timestampIndex], 10)
      };
    } // Apparently the `trimZeros` doesn't catch all the special characters. With this function I'm extracting the JSON.

  }, {
    key: "sanitizeJSON",
    value: function sanitizeJSON(input) {
      return input.match(/{.*}/)[0];
    }
  }]);

  return CryptUtil;
}();

export default CryptUtil;