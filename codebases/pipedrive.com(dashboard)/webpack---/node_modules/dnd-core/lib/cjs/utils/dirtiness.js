"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var discount_lodash_1 = require("./discount_lodash");
exports.NONE = [];
exports.ALL = [];
exports.NONE.__IS_NONE__ = true;
exports.ALL.__IS_ALL__ = true;
/**
 * Determines if the given handler IDs are dirty or not.
 *
 * @param dirtyIds The set of dirty handler ids
 * @param handlerIds The set of handler ids to check
 */
function areDirty(dirtyIds, handlerIds) {
    if (dirtyIds === exports.NONE) {
        return false;
    }
    if (dirtyIds === exports.ALL || typeof handlerIds === 'undefined') {
        return true;
    }
    var commonIds = discount_lodash_1.intersection(handlerIds, dirtyIds);
    return commonIds.length > 0;
}
exports.areDirty = areDirty;
