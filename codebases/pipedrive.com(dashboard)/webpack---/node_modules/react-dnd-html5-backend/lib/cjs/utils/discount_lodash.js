"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function memoize(fn) {
    var result = null;
    var memoized = function () {
        if (result == null) {
            result = fn();
        }
        return result;
    };
    return memoized;
}
exports.memoize = memoize;
/**
 * drop-in replacement for _.without
 */
function without(items, item) {
    return items.filter(function (i) { return i !== item; });
}
exports.without = without;
function union(itemsA, itemsB) {
    var set = new Set();
    var insertItem = function (item) { return set.add(item); };
    itemsA.forEach(insertItem);
    itemsB.forEach(insertItem);
    var result = [];
    set.forEach(function (key) { return result.push(key); });
    return result;
}
exports.union = union;
