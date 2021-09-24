'use es6';
/* eslint-disable */

import { PADDING } from './constants';
import { stringToU8 } from './encoding';
export function signedToUnsigned(signed) {
  return signed >>> 0;
}
export function xor(a, b) {
  return signedToUnsigned(a ^ b);
}
export function sumMod32(a, b) {
  return signedToUnsigned(a + b | 0);
}
export function packFourBytes(byte1, byte2, byte3, byte4) {
  return signedToUnsigned(byte1 << 24 | byte2 << 16 | byte3 << 8 | byte4);
}
export function unpackFourBytes(pack) {
  return [pack >>> 24 & 0xff, pack >>> 16 & 0xff, pack >>> 8 & 0xff, pack & 0xff];
}
export function isString(val) {
  return typeof val === 'string';
}
export function isBuffer(val) {
  return typeof val === 'object' && 'byteLength' in val;
}
export function isStringOrBuffer(val) {
  return isString(val) || isBuffer(val);
}
export function includes(obj, val) {
  var result = false;
  Object.keys(obj).forEach(function (key) {
    if (obj[key] === val) {
      result = true;
    }
  });
  return result;
}
export function toUint8Array(val) {
  if (isString(val)) {
    return stringToU8(val);
  } else if (isBuffer(val)) {
    return new Uint8Array(val);
  }

  throw new Error('Unsupported type');
}
export function expandKey(key) {
  if (key.length >= 72) {
    // 576 bits -> 72 bytes
    return key;
  }

  var longKey = [];

  while (longKey.length < 72) {
    for (var i = 0; i < key.length; i++) {
      longKey.push(key[i]);
    }
  }

  return new Uint8Array(longKey);
}
export function pad(bytes, padding) {
  var count = 8 - bytes.length % 8;

  if (count === 8 && bytes.length > 0 && padding !== PADDING.PKCS5) {
    return bytes;
  }

  var writer = new Uint8Array(bytes.length + count);
  var newBytes = [];
  var remaining = count;
  var padChar = 0;

  switch (padding) {
    case PADDING.PKCS5:
      {
        padChar = count;
        break;
      }

    case PADDING.ONE_AND_ZEROS:
      {
        newBytes.push(0x80);
        remaining--;
        break;
      }

    case PADDING.SPACES:
      {
        padChar = 0x20;
        break;
      }
  }

  while (remaining > 0) {
    if (padding === PADDING.LAST_BYTE && remaining === 1) {
      newBytes.push(count);
      break;
    }

    newBytes.push(padChar);
    remaining--;
  }

  writer.set(bytes);
  writer.set(newBytes, bytes.length);
  return writer;
}
export function unpad(bytes, padding) {
  var cutLength = 0;

  switch (padding) {
    case PADDING.LAST_BYTE:
    case PADDING.PKCS5:
      {
        var lastChar = bytes[bytes.length - 1];

        if (lastChar <= 8) {
          cutLength = lastChar;
        }

        break;
      }

    case PADDING.ONE_AND_ZEROS:
      {
        var i = 1;

        while (i <= 8) {
          var char = bytes[bytes.length - i];

          if (char === 0x80) {
            cutLength = i;
            break;
          }

          if (char !== 0) {
            break;
          }

          i++;
        }

        break;
      }

    case PADDING.NULL:
    case PADDING.SPACES:
      {
        var padChar = padding === PADDING.SPACES ? 0x20 : 0;
        var _i = 1;

        while (_i <= 8) {
          var _char = bytes[bytes.length - _i];

          if (_char !== padChar) {
            cutLength = _i - 1;
            break;
          }

          _i++;
        }

        break;
      }
  }

  return bytes.subarray(0, bytes.length - cutLength);
}