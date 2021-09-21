var S = new Uint8Array(256);
var Si = new Uint8Array(256);
var T1 = new Uint32Array(256);
var T2 = new Uint32Array(256);
var T3 = new Uint32Array(256);
var T4 = new Uint32Array(256);
var T5 = new Uint32Array(256);
var T6 = new Uint32Array(256);
var T7 = new Uint32Array(256);
var T8 = new Uint32Array(256);
function computeTables() {
    var d = new Uint8Array(256);
    var t = new Uint8Array(256);
    var x2;
    var x4;
    var x8;
    var s;
    var tEnc;
    var tDec;
    var x = 0;
    var xInv = 0;
    // Compute double and third tables
    for (var i = 0; i < 256; i++) {
        d[i] = i << 1 ^ (i >> 7) * 283;
        t[d[i] ^ i] = i;
    }
    for (; !S[x]; x ^= x2 || 1) {
        // Compute sbox
        s = xInv ^ xInv << 1 ^ xInv << 2 ^ xInv << 3 ^ xInv << 4;
        s = s >> 8 ^ s & 255 ^ 99;
        S[x] = s;
        Si[s] = x;
        // Compute MixColumns
        x8 = d[x4 = d[x2 = d[x]]];
        tDec = x8 * 0x1010101 ^ x4 * 0x10001 ^ x2 * 0x101 ^ x * 0x1010100;
        tEnc = d[s] * 0x101 ^ s * 0x1010100;
        T1[x] = tEnc = tEnc << 24 ^ tEnc >>> 8;
        T2[x] = tEnc = tEnc << 24 ^ tEnc >>> 8;
        T3[x] = tEnc = tEnc << 24 ^ tEnc >>> 8;
        T4[x] = tEnc = tEnc << 24 ^ tEnc >>> 8;
        T5[s] = tDec = tDec << 24 ^ tDec >>> 8;
        T6[s] = tDec = tDec << 24 ^ tDec >>> 8;
        T7[s] = tDec = tDec << 24 ^ tDec >>> 8;
        T8[s] = tDec = tDec << 24 ^ tDec >>> 8;
        xInv = t[xInv] || 1;
    }
}

/**
 * Gets a uint32 from string in big-endian order order
 */
function s2i(str, pos) {
    return (str.charCodeAt(pos) << 24
        ^ str.charCodeAt(pos + 1) << 16
        ^ str.charCodeAt(pos + 2) << 8
        ^ str.charCodeAt(pos + 3));
}

/* eslint-disable import/prefer-default-export */
/**
 * Helper function for transforming string key to Uint32Array
 */
function getWords(key) {
    if (key instanceof Uint32Array) {
        return key;
    }
    if (typeof key === 'string') {
        if (key.length % 4 !== 0)
            for (var i = key.length % 4; i <= 4; i++)
                key += '\0x00';
        var buf = new Uint32Array(key.length / 4);
        for (var i = 0; i < key.length; i += 4)
            buf[i / 4] = s2i(key, i);
        return buf;
    }
    if (key instanceof Uint8Array) {
        var buf = new Uint32Array(key.length / 4);
        for (var i = 0; i < key.length; i += 4) {
            buf[i / 4] = (key[i] << 24
                ^ key[i + 1] << 16
                ^ key[i + 2] << 8
                ^ key[i + 3]);
        }
        return buf;
    }
    throw new Error('Unable to create 32-bit words');
}
function xor(left, right, to) {
    if (to === void 0) { to = left; }
    for (var i = 0; i < left.length; i++)
        to[i] = left[i] ^ right[i];
}

computeTables();
/**
 * Low-level AES Cipher
 */
var AES = /** @class */ (function () {
    function AES(_key) {
        var key = getWords(_key);
        if (key.length !== 4 && key.length !== 6 && key.length !== 8) {
            throw new Error('Invalid key size');
        }
        this.encKey = new Uint32Array(4 * key.length + 28);
        this.decKey = new Uint32Array(4 * key.length + 28);
        this.encKey.set(key);
        var rcon = 1;
        var i = key.length;
        var tmp;
        // schedule encryption keys
        for (; i < 4 * key.length + 28; i++) {
            tmp = this.encKey[i - 1];
            // apply sbox
            if (i % key.length === 0 || (key.length === 8 && i % key.length === 4)) {
                tmp = S[tmp >>> 24] << 24 ^ S[(tmp >> 16) & 255] << 16 ^ S[(tmp >> 8) & 255] << 8 ^ S[tmp & 255];
                // shift rows and add rcon
                if (i % key.length === 0) {
                    tmp = tmp << 8 ^ tmp >>> 24 ^ (rcon << 24);
                    rcon = rcon << 1 ^ (rcon >> 7) * 283;
                }
            }
            this.encKey[i] = this.encKey[i - key.length] ^ tmp;
        }
        // schedule decryption keys
        for (var j = 0; i; j++, i--) {
            tmp = this.encKey[j & 3 ? i : i - 4];
            if (i <= 4 || j < 4) {
                this.decKey[j] = tmp;
            }
            else {
                this.decKey[j] = (T5[S[tmp >>> 24]]
                    ^ T6[S[(tmp >> 16) & 255]]
                    ^ T7[S[(tmp >> 8) & 255]]
                    ^ T8[S[tmp & 255]]);
            }
        }
    }
    AES.prototype.encrypt = function (_message) {
        var message = getWords(_message);
        var out = new Uint32Array(4);
        var a = message[0] ^ this.encKey[0];
        var b = message[1] ^ this.encKey[1];
        var c = message[2] ^ this.encKey[2];
        var d = message[3] ^ this.encKey[3];
        var rounds = this.encKey.length / 4 - 2;
        var k = 4;
        var a2;
        var b2;
        var c2;
        // Inner rounds.  Cribbed from OpenSSL.
        for (var i = 0; i < rounds; i++) {
            a2 = T1[a >>> 24] ^ T2[(b >> 16) & 255] ^ T3[(c >> 8) & 255] ^ T4[d & 255] ^ this.encKey[k];
            b2 = T1[b >>> 24] ^ T2[(c >> 16) & 255] ^ T3[(d >> 8) & 255] ^ T4[a & 255] ^ this.encKey[k + 1];
            c2 = T1[c >>> 24] ^ T2[(d >> 16) & 255] ^ T3[(a >> 8) & 255] ^ T4[b & 255] ^ this.encKey[k + 2];
            d = T1[d >>> 24] ^ T2[(a >> 16) & 255] ^ T3[(b >> 8) & 255] ^ T4[c & 255] ^ this.encKey[k + 3];
            a = a2;
            b = b2;
            c = c2;
            k += 4;
            // console.log(a, b, c, d);
        }
        // Last round.
        for (var i = 0; i < 4; i++) {
            out[i] = (S[a >>> 24] << 24
                ^ S[(b >> 16) & 255] << 16
                ^ S[(c >> 8) & 255] << 8
                ^ S[d & 255]
                ^ this.encKey[k++]);
            a2 = a;
            a = b;
            b = c;
            c = d;
            d = a2;
        }
        return out;
    };
    AES.prototype.decrypt = function (_message) {
        var message = getWords(_message);
        var out = new Uint32Array(4);
        var a = message[0] ^ this.decKey[0];
        var b = message[3] ^ this.decKey[1];
        var c = message[2] ^ this.decKey[2];
        var d = message[1] ^ this.decKey[3];
        var rounds = this.decKey.length / 4 - 2;
        var a2;
        var b2;
        var c2;
        var k = 4;
        // Inner rounds.  Cribbed from OpenSSL.
        for (var i = 0; i < rounds; i++) {
            a2 = T5[a >>> 24] ^ T6[(b >> 16) & 255] ^ T7[(c >> 8) & 255] ^ T8[d & 255] ^ this.decKey[k];
            b2 = T5[b >>> 24] ^ T6[(c >> 16) & 255] ^ T7[(d >> 8) & 255] ^ T8[a & 255] ^ this.decKey[k + 1];
            c2 = T5[c >>> 24] ^ T6[(d >> 16) & 255] ^ T7[(a >> 8) & 255] ^ T8[b & 255] ^ this.decKey[k + 2];
            d = T5[d >>> 24] ^ T6[(a >> 16) & 255] ^ T7[(b >> 8) & 255] ^ T8[c & 255] ^ this.decKey[k + 3];
            a = a2;
            b = b2;
            c = c2;
            k += 4;
        }
        // Last round.
        for (var i = 0; i < 4; i++) {
            out[3 & -i] = (Si[a >>> 24] << 24
                ^ Si[(b >> 16) & 255] << 16
                ^ Si[(c >> 8) & 255] << 8
                ^ Si[d & 255]
                ^ this.decKey[k++]);
            a2 = a;
            a = b;
            b = c;
            c = d;
            d = a2;
        }
        return out;
    };
    return AES;
}());

/**
 * AES-IGE mode.
 */
var AES_IGE = /** @class */ (function () {
    function AES_IGE(key, iv, blockSize) {
        if (blockSize === void 0) { blockSize = 16; }
        this.key = getWords(key);
        this.iv = getWords(iv);
        this.cipher = new AES(key);
        this.blockSize = blockSize / 4;
    }
    /**
     * Encrypts plain text with AES-IGE mode.
     */
    AES_IGE.prototype.encrypt = function (message, buf) {
        var text = getWords(message);
        var cipherText = buf || new Uint32Array(text.length);
        var prevX = this.iv.subarray(this.blockSize, this.iv.length);
        var prevY = this.iv.subarray(0, this.blockSize);
        var yXOR = new Uint32Array(this.blockSize);
        for (var i = 0; i < text.length; i += this.blockSize) {
            var x = text.subarray(i, i + this.blockSize);
            xor(x, prevY, yXOR);
            var y = this.cipher.encrypt(yXOR);
            xor(y, prevX);
            prevX = x;
            prevY = y;
            for (var j = i, k = 0; j < text.length && k < 4; j++, k++)
                cipherText[j] = y[k];
        }
        return cipherText;
    };
    /**
     * Decrypts cipher text with AES-IGE mode.
     */
    AES_IGE.prototype.decrypt = function (message, buf) {
        var cipherText = getWords(message);
        var text = buf || new Uint32Array(cipherText.length);
        var prevY = this.iv.subarray(this.blockSize, this.iv.length);
        var prevX = this.iv.subarray(0, this.blockSize);
        var yXOR = new Uint32Array(this.blockSize);
        for (var i = 0; i < text.length; i += this.blockSize) {
            var x = cipherText.subarray(i, i + this.blockSize);
            xor(x, prevY, yXOR);
            var y = this.cipher.decrypt(yXOR);
            xor(y, prevX);
            prevX = x;
            prevY = y;
            for (var j = i, k = 0; j < text.length && k < 4; j++, k++)
                text[j] = y[k];
        }
        return text;
    };
    return AES_IGE;
}());

/**
 * AES-IGE mode.
 */
var AES_IGE$1 = /** @class */ (function () {
    function AES_IGE(key, counter, blockSize) {
        if (blockSize === void 0) { blockSize = 16; }
        this.offset = 0;
        this.key = getWords(key);
        this.counter = getWords(counter);
        this.cipher = new AES(key);
        this.blockSize = blockSize / 4;
        if (this.counter.length !== 4) {
            throw new Error('AES-CTR mode counter must be 16 bytes length');
        }
    }
    /**
     * Encrypts plain text with AES-IGE mode.
     */
    AES_IGE.prototype.encrypt = function (message, buf) {
        var text = getWords(message);
        var cipherText = buf || new Uint32Array(text.length);
        var offset = this.offset;
        for (var i = 0; i < text.length; i += this.blockSize) {
            var x = this.cipher.encrypt(this.counter);
            for (var j = i, k = offset; j < text.length && k < this.blockSize; j++, k++)
                cipherText[j] = x[k] ^ text[j];
            if (text.length - i >= this.blockSize)
                this.incrementCounter();
            if (offset) {
                i -= offset;
                offset = 0;
            }
        }
        this.offset = (this.offset + (text.length % 4)) % 4;
        return cipherText;
    };
    /**
     * Decrypts cipher text with AES-IGE mode.
     */
    AES_IGE.prototype.decrypt = function (message, buf) {
        return this.encrypt(message, buf);
    };
    AES_IGE.prototype.incrementCounter = function () {
        // increment counter
        for (var carry = this.counter.length - 1; carry >= 0; carry--) {
            if (++this.counter[carry] < 0xFFFFFFFF)
                break; // If overflowing, it'll be 0 and we'll have to continue propagating the carry
        }
    };
    return AES_IGE;
}());

export default AES;
export { AES_IGE$1 as CTR, AES_IGE as IGE };
