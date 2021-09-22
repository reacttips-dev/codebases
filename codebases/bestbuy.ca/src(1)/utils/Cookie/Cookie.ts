"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:variable-name
/**
 * This was originally taken from bbyca-components
 */
var Cookie = /** @class */ (function () {
    function Cookie(name, value) {
        this.DEFAULT_PATH = "/";
        this.EMPTY_STRING = "";
        this._path = this.DEFAULT_PATH;
        this._name = name;
        this._value = value;
    }
    Object.defineProperty(Cookie.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cookie.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (value) {
            this._value = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cookie.prototype, "path", {
        get: function () {
            return this._path;
        },
        set: function (path) {
            this._path = path.length <= 0 ? this.DEFAULT_PATH : path;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cookie.prototype, "secure", {
        get: function () {
            return this._secure;
        },
        set: function (isSecure) {
            this._secure = isSecure;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cookie.prototype, "httpOnly", {
        get: function () {
            return this._httpOnly;
        },
        set: function (isHttpOnly) {
            this._httpOnly = isHttpOnly;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cookie.prototype, "domain", {
        get: function () {
            return this._domain;
        },
        set: function (domain) {
            // TODO: validate if bestbuy domain
            this._domain = domain !== undefined ? domain : this.EMPTY_STRING;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cookie.prototype, "expires", {
        get: function () {
            return this._expires;
        },
        set: function (expiry) {
            this._expires = expiry;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cookie.prototype, "maxAge", {
        get: function () {
            return this._maxAge;
        },
        set: function (maxAge) {
            this._maxAge = maxAge;
        },
        enumerable: true,
        configurable: true
    });
    Cookie.prototype.serialize = function () {
        var serializedExpires = this.expires ? "expires=" + this.expires.toUTCString() + ";" : this.EMPTY_STRING;
        var serializedDomain = this.domain ? "domain=" + this.domain + ";" : this.EMPTY_STRING;
        var serializedMaxAge = this.maxAge ? "max-age=" + this.maxAge + ";" : this.EMPTY_STRING;
        var serializedPath = this.path ? "path=" + this.path + ";" : this.EMPTY_STRING;
        var serializedSecure = this.secure ? "secure;" : this.EMPTY_STRING;
        var serializedHttpOnly = this.httpOnly ? "httpOnly;" : this.EMPTY_STRING;
        var seriealizedCookie = this._name + "=" + this._value + ";" + serializedExpires + serializedMaxAge
            + ("" + serializedDomain + serializedPath + serializedSecure + serializedHttpOnly);
        return seriealizedCookie.slice(-1) === ";" ? seriealizedCookie.slice(0, -1) : seriealizedCookie;
    };
    return Cookie;
}());
exports.Cookie = Cookie;
exports.default = Cookie;
//# sourceMappingURL=Cookie.js.map