"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isFunction(input) {
    return typeof input === 'function';
}
exports.isFunction = isFunction;
function noop() {
    // noop
}
exports.noop = noop;
function isObjectLike(input) {
    return typeof input === 'object' && input !== null;
}
function isPlainObject(input) {
    if (!isObjectLike(input)) {
        return false;
    }
    if (Object.getPrototypeOf(input) === null) {
        return true;
    }
    var proto = input;
    while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(input) === proto;
}
exports.isPlainObject = isPlainObject;
