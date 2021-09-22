"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This was originally taken from bbyca-components
 */
var Cookie_1 = __importDefault(require("../Cookie/Cookie"));
var EMPTY_VALUE = "";
var MIN_EXPIRY_DATE = new Date(1970, 1, 1, 0, 0, 1);
exports.CookieUtils = {
    getCookie: function (name) {
        if (typeof document === "undefined" || !document.cookie) {
            return undefined;
        }
        try {
            var regexp = new RegExp("(?:(?:^|.*;\\s*)" + name + "\\s*\\=\\s*([^;]*).*$)|^.*$");
            // find within all cookies the cookie value or provided cookie name
            var browserCookieValue = document.cookie.replace(regexp, "$1");
            if (!browserCookieValue) {
                return undefined;
            }
            return new Cookie_1.default(name, browserCookieValue);
        }
        catch (error) {
            return undefined;
        }
    },
    setCookie: function (cookie) {
        if (typeof document === "undefined") {
            throw new Error("Document object of browser does not exist.");
        }
        if (!cookie) {
            throw new Error("Invalid cookie");
        }
        document.cookie = cookie.serialize();
    },
    removeCookie: function (name, domain) {
        var cookieToRemove = exports.CookieUtils.getCookie(name);
        if (!cookieToRemove) {
            throw new Error("Cookie to be removed does not exist");
        }
        cookieToRemove.value = EMPTY_VALUE;
        cookieToRemove.maxAge = 0;
        cookieToRemove.expires = MIN_EXPIRY_DATE;
        if (domain) {
            cookieToRemove.domain = domain;
        }
        exports.CookieUtils.setCookie(cookieToRemove);
    },
};
exports.default = exports.CookieUtils;
//# sourceMappingURL=CookieUtils.js.map