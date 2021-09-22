"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var discount_lodash_1 = require("./utils/discount_lodash");
exports.isFirefox = discount_lodash_1.memoize(function () {
    return /firefox/i.test(navigator.userAgent);
});
exports.isSafari = discount_lodash_1.memoize(function () { return Boolean(window.safari); });
