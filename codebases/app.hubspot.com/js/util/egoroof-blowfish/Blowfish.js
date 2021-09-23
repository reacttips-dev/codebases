'use es6'; // The MIT License (MIT)
//
// Copyright Artyom Egorov mail@egoroof.ru
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/* eslint-disable */

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import { MODE, PADDING, TYPE, P, S0, S1, S2, S3 } from './constants';
import { isStringOrBuffer, includes, expandKey, toUint8Array, packFourBytes, unpackFourBytes, xor, pad, unpad, sumMod32 } from './helpers';
import { u8ToString } from './encoding';

var Blowfish = /*#__PURE__*/function () {
  _createClass(Blowfish, null, [{
    key: "MODE",
    get: function get() {
      return MODE;
    }
  }, {
    key: "PADDING",
    get: function get() {
      return PADDING;
    }
  }, {
    key: "TYPE",
    get: function get() {
      return TYPE;
    }
  }]);

  function Blowfish(key) {
    var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : MODE.ECB;
    var padding = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : PADDING.PKCS5;

    _classCallCheck(this, Blowfish);

    if (!isStringOrBuffer(key)) {
      throw new Error('Key should be a string or an ArrayBuffer / Buffer');
    }

    if (!includes(MODE, mode)) {
      throw new Error('Unsupported mode');
    }

    if (!includes(PADDING, padding)) {
      throw new Error('Unsupported padding');
    }

    this.mode = mode;
    this.padding = padding;
    this.iv = null;
    this.p = P.slice();
    this.s = [S0.slice(), S1.slice(), S2.slice(), S3.slice()];
    key = expandKey(toUint8Array(key));

    for (var i = 0, j = 0; i < 18; i++, j += 4) {
      var n = packFourBytes(key[j], key[j + 1], key[j + 2], key[j + 3]);
      this.p[i] = xor(this.p[i], n);
    }

    var l = 0;
    var r = 0;

    for (var _i = 0; _i < 18; _i += 2) {
      var _this$_encryptBlock = this._encryptBlock(l, r);

      var _this$_encryptBlock2 = _slicedToArray(_this$_encryptBlock, 2);

      l = _this$_encryptBlock2[0];
      r = _this$_encryptBlock2[1];
      this.p[_i] = l;
      this.p[_i + 1] = r;
    }

    for (var _i2 = 0; _i2 < 4; _i2++) {
      for (var _j = 0; _j < 256; _j += 2) {
        var _this$_encryptBlock3 = this._encryptBlock(l, r);

        var _this$_encryptBlock4 = _slicedToArray(_this$_encryptBlock3, 2);

        l = _this$_encryptBlock4[0];
        r = _this$_encryptBlock4[1];
        this.s[_i2][_j] = l;
        this.s[_i2][_j + 1] = r;
      }
    }
  }

  _createClass(Blowfish, [{
    key: "setIv",
    value: function setIv(iv) {
      if (!isStringOrBuffer(iv)) {
        throw new Error('IV should be a string or an ArrayBuffer / Buffer');
      }

      iv = toUint8Array(iv);

      if (iv.length !== 8) {
        throw new Error('IV should be 8 byte length');
      }

      this.iv = iv;
    }
  }, {
    key: "encode",
    value: function encode(data) {
      if (!isStringOrBuffer(data)) {
        throw new Error('Encode data should be a string or an ArrayBuffer / Buffer');
      }

      if (this.mode !== MODE.ECB && !this.iv) {
        throw new Error('IV is not set');
      }

      data = pad(toUint8Array(data), this.padding);

      if (this.mode === MODE.ECB) {
        return this._encodeECB(data);
      } else if (this.mode === MODE.CBC) {
        return this._encodeCBC(data);
      }
    }
  }, {
    key: "decode",
    value: function decode(data) {
      var returnType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : TYPE.STRING;

      if (!isStringOrBuffer(data)) {
        throw new Error('Decode data should be a string or an ArrayBuffer / Buffer');
      }

      if (this.mode !== MODE.ECB && !this.iv) {
        throw new Error('IV is not set');
      }

      data = toUint8Array(data);

      if (data.length % 8 !== 0) {
        throw new Error('Decoded data should be multiple of 8 bytes');
      }

      switch (this.mode) {
        case MODE.ECB:
          {
            data = this._decodeECB(data);
            break;
          }

        case MODE.CBC:
          {
            data = this._decodeCBC(data);
            break;
          }
      }

      data = unpad(data, this.padding);

      switch (returnType) {
        case TYPE.UINT8_ARRAY:
          {
            return data;
          }

        case TYPE.STRING:
          {
            return u8ToString(data);
          }

        default:
          {
            throw new Error('Unsupported return type');
          }
      }
    }
  }, {
    key: "_encryptBlock",
    value: function _encryptBlock(l, r) {
      for (var i = 0; i < 16; i++) {
        l = xor(l, this.p[i]);
        r = xor(r, this._f(l));
        var _ref = [r, l];
        l = _ref[0];
        r = _ref[1];
      }

      var _ref2 = [r, l];
      l = _ref2[0];
      r = _ref2[1];
      r = xor(r, this.p[16]);
      l = xor(l, this.p[17]);
      return [l, r];
    }
  }, {
    key: "_decryptBlock",
    value: function _decryptBlock(l, r) {
      for (var i = 17; i > 1; i--) {
        l = xor(l, this.p[i]);
        r = xor(r, this._f(l));
        var _ref3 = [r, l];
        l = _ref3[0];
        r = _ref3[1];
      }

      var _ref4 = [r, l];
      l = _ref4[0];
      r = _ref4[1];
      r = xor(r, this.p[1]);
      l = xor(l, this.p[0]);
      return [l, r];
    }
  }, {
    key: "_f",
    value: function _f(x) {
      var a = x >>> 24 & 0xff;
      var b = x >>> 16 & 0xff;
      var c = x >>> 8 & 0xff;
      var d = x & 0xff;
      var res = sumMod32(this.s[0][a], this.s[1][b]);
      res = xor(res, this.s[2][c]);
      return sumMod32(res, this.s[3][d]);
    }
  }, {
    key: "_encodeECB",
    value: function _encodeECB(bytes) {
      var encoded = new Uint8Array(bytes.length);

      for (var i = 0; i < bytes.length; i += 8) {
        var _l = packFourBytes(bytes[i], bytes[i + 1], bytes[i + 2], bytes[i + 3]);

        var _r = packFourBytes(bytes[i + 4], bytes[i + 5], bytes[i + 6], bytes[i + 7]);

        var _this$_encryptBlock5 = this._encryptBlock(_l, _r);

        var _this$_encryptBlock6 = _slicedToArray(_this$_encryptBlock5, 2);

        _l = _this$_encryptBlock6[0];
        _r = _this$_encryptBlock6[1];
        encoded.set(unpackFourBytes(_l), i);
        encoded.set(unpackFourBytes(_r), i + 4);
      }

      return encoded;
    }
  }, {
    key: "_encodeCBC",
    value: function _encodeCBC(bytes) {
      var encoded = new Uint8Array(bytes.length);
      var prevL = packFourBytes(this.iv[0], this.iv[1], this.iv[2], this.iv[3]);
      var prevR = packFourBytes(this.iv[4], this.iv[5], this.iv[6], this.iv[7]);

      for (var i = 0; i < bytes.length; i += 8) {
        var _l2 = packFourBytes(bytes[i], bytes[i + 1], bytes[i + 2], bytes[i + 3]);

        var _r2 = packFourBytes(bytes[i + 4], bytes[i + 5], bytes[i + 6], bytes[i + 7]);

        var _ref5 = [xor(prevL, _l2), xor(prevR, _r2)];
        _l2 = _ref5[0];
        _r2 = _ref5[1];

        var _this$_encryptBlock7 = this._encryptBlock(_l2, _r2);

        var _this$_encryptBlock8 = _slicedToArray(_this$_encryptBlock7, 2);

        _l2 = _this$_encryptBlock8[0];
        _r2 = _this$_encryptBlock8[1];
        prevL = _l2;
        prevR = _r2;
        encoded.set(unpackFourBytes(_l2), i);
        encoded.set(unpackFourBytes(_r2), i + 4);
      }

      return encoded;
    }
  }, {
    key: "_decodeECB",
    value: function _decodeECB(bytes) {
      var decoded = new Uint8Array(bytes.length);

      for (var i = 0; i < bytes.length; i += 8) {
        var _l3 = packFourBytes(bytes[i], bytes[i + 1], bytes[i + 2], bytes[i + 3]);

        var _r3 = packFourBytes(bytes[i + 4], bytes[i + 5], bytes[i + 6], bytes[i + 7]);

        var _this$_decryptBlock = this._decryptBlock(_l3, _r3);

        var _this$_decryptBlock2 = _slicedToArray(_this$_decryptBlock, 2);

        _l3 = _this$_decryptBlock2[0];
        _r3 = _this$_decryptBlock2[1];
        decoded.set(unpackFourBytes(_l3), i);
        decoded.set(unpackFourBytes(_r3), i + 4);
      }

      return decoded;
    }
  }, {
    key: "_decodeCBC",
    value: function _decodeCBC(bytes) {
      var decoded = new Uint8Array(bytes.length);
      var prevL = packFourBytes(this.iv[0], this.iv[1], this.iv[2], this.iv[3]);
      var prevR = packFourBytes(this.iv[4], this.iv[5], this.iv[6], this.iv[7]);
      var prevLTmp;
      var prevRTmp;

      for (var i = 0; i < bytes.length; i += 8) {
        var _l4 = packFourBytes(bytes[i], bytes[i + 1], bytes[i + 2], bytes[i + 3]);

        var _r4 = packFourBytes(bytes[i + 4], bytes[i + 5], bytes[i + 6], bytes[i + 7]);

        prevLTmp = _l4;
        prevRTmp = _r4;

        var _this$_decryptBlock3 = this._decryptBlock(_l4, _r4);

        var _this$_decryptBlock4 = _slicedToArray(_this$_decryptBlock3, 2);

        _l4 = _this$_decryptBlock4[0];
        _r4 = _this$_decryptBlock4[1];
        var _ref6 = [xor(prevL, _l4), xor(prevR, _r4)];
        _l4 = _ref6[0];
        _r4 = _ref6[1];
        prevL = prevLTmp;
        prevR = prevRTmp;
        decoded.set(unpackFourBytes(_l4), i);
        decoded.set(unpackFourBytes(_r4), i + 4);
      }

      return decoded;
    }
  }]);

  return Blowfish;
}();

export { Blowfish as default };