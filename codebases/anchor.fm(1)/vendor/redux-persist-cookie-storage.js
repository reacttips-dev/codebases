/**
 * Copy of redux-persist-cookie-storage v0.3.0
 * https://github.com/abersager/redux-persist-cookie-storage/tree/v0.3.0
 *
 * Extends/modifies the original module by adding a guard against malformed JSON in `CookieStorage#getAllKeys`
 *
 * See https://anchorfm.atlassian.net/browse/ENG-3478 for context
 */
const serialize = require('serialize-javascript');
const Cookies = require('cookies-js');
const FakeCookieJar = require('./fake-cookie-jar');

function CookieStorage(options) {
  options = options || {};

  this.keyPrefix = options.keyPrefix || '';
  this.indexKey = options.indexKey || 'reduxPersistIndex';
  this.expiration = options.expiration || {};
  if (!this.expiration.default) {
    this.expiration.default = null;
  }

  if (options.windowRef) {
    this.cookies = Cookies(options.windowRef);
  } else if (typeof window !== 'undefined') {
    this.cookies = Cookies;
  } else if (options.cookies) {
    if (
      'get' in options.cookies &&
      'set' in options.cookies &&
      'expire' in options.cookies
    ) {
      this.cookies = options.cookies;
    } else {
      this.cookies = new FakeCookieJar(options.cookies);
    }
  }
}

CookieStorage.prototype.getItem = function(key, callback) {
  callback(null, this.cookies.get(this.keyPrefix + key) || 'null');
};

CookieStorage.prototype.setItem = function(key, value, callback) {
  const options = {};

  let expires = this.expiration.default;
  if (typeof this.expiration[key] !== 'undefined') {
    expires = this.expiration[key];
  }
  if (expires) {
    options.expires = expires;
  }

  this.cookies.set(this.keyPrefix + key, value, options);

  // Update key index

  const indexOptions = {};
  if (this.expiration.default) {
    indexOptions.expires = this.expiration.default;
  }

  this.getAllKeys((error, allKeys) => {
    if (allKeys.indexOf(key) === -1) {
      allKeys.push(key);
      this.cookies.set(
        this.indexKey,
        serialize(allKeys, {
          isJSON: true,
        }),
        indexOptions
      );
    }
    callback(null);
  });
};

CookieStorage.prototype.removeItem = function(key, callback) {
  this.cookies.expire(this.keyPrefix + key);

  this.getAllKeys((error, allKeys) => {
    allKeys = allKeys.filter(k => k !== key);

    this.cookies.set(
      this.indexKey,
      serialize(allKeys, {
        isJSON: true,
      })
    );
    callback(null);
  });
};

const validateJSON = str => {
  if (typeof str !== 'string') return false;
  try {
    JSON.parse(str);
    return true;
  } catch (err) {
    return false;
  }
};

CookieStorage.prototype.getAllKeys = function(callback) {
  const cookie = this.cookies.get(this.indexKey);

  let result = [];
  if (cookie && validateJSON(cookie)) {
    try {
      result = JSON.parse(cookie);
    } catch (err) {}
  }

  callback(null, result);
};

module.exports = CookieStorage;
