"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * drop-in replacement for _.get
 * @param obj
 * @param path
 * @param defaultValue
 */
function get(obj, path, defaultValue) {
    return path
        .split('.')
        .reduce(function (a, c) { return (a && a[c] ? a[c] : defaultValue || null); }, obj);
}
exports.get = get;
/**
 * drop-in replacement for _.without
 */
function without(items, item) {
    return items.filter(function (i) { return i !== item; });
}
exports.without = without;
/**
 * drop-in replacement for _.isString
 * @param input
 */
function isString(input) {
    return typeof input === 'string';
}
exports.isString = isString;
/**
 * drop-in replacement for _.isString
 * @param input
 */
function isObject(input) {
    return typeof input === 'object';
}
exports.isObject = isObject;
/**
 * repalcement for _.xor
 * @param itemsA
 * @param itemsB
 */
function xor(itemsA, itemsB) {
    var map = new Map();
    var insertItem = function (item) {
        return map.set(item, map.has(item) ? map.get(item) + 1 : 1);
    };
    itemsA.forEach(insertItem);
    itemsB.forEach(insertItem);
    var result = [];
    map.forEach(function (count, key) {
        if (count === 1) {
            result.push(key);
        }
    });
    return result;
}
exports.xor = xor;
/**
 * replacement for _.intersection
 * @param itemsA
 * @param itemsB
 */
function intersection(itemsA, itemsB) {
    return itemsA.filter(function (t) { return itemsB.indexOf(t) > -1; });
}
exports.intersection = intersection;
