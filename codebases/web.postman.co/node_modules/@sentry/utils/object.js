"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var is_1 = require("./is");
var memo_1 = require("./memo");
var string_1 = require("./string");
/**
 * Serializes the given object into a string.
 * Like JSON.stringify, but doesn't throw on circular references.
 *
 * @param object A JSON-serializable object.
 * @returns A string containing the serialized object.
 */
function serialize(object) {
    return JSON.stringify(object, serializer({ normalize: false }));
}
exports.serialize = serialize;
/**
 * Deserializes an object from a string previously serialized with
 * {@link serialize}.
 *
 * @param str A serialized object.
 * @returns The deserialized object.
 */
function deserialize(str) {
    return JSON.parse(str);
}
exports.deserialize = deserialize;
/**
 * Creates a deep copy of the given object.
 *
 * The object must be serializable, i.e.:
 *  - It must not contain any cycles
 *  - Only primitive types are allowed (object, array, number, string, boolean)
 *  - Its depth should be considerably low for performance reasons
 *
 * @param object A JSON-serializable object.
 * @returns The object clone.
 */
function clone(object) {
    return deserialize(serialize(object));
}
exports.clone = clone;
/**
 * Wrap a given object method with a higher-order function
 *
 * @param source An object that contains a method to be wrapped.
 * @param name A name of method to be wrapped.
 * @param replacement A function that should be used to wrap a given method.
 * @returns void
 */
function fill(source, name, replacement) {
    if (!(name in source) || source[name].__sentry__) {
        return;
    }
    var original = source[name];
    var wrapped = replacement(original);
    // Make sure it's a function first, as we need to attach an empty prototype for `defineProperties` to work
    // otherwise it'll throw "TypeError: Object.defineProperties called on non-object"
    // tslint:disable-next-line:strict-type-predicates
    if (typeof wrapped === 'function') {
        wrapped.prototype = wrapped.prototype || {};
        Object.defineProperties(wrapped, {
            __sentry__: {
                enumerable: false,
                value: true,
            },
            __sentry_original__: {
                enumerable: false,
                value: original,
            },
            __sentry_wrapped__: {
                enumerable: false,
                value: wrapped,
            },
        });
    }
    source[name] = wrapped;
}
exports.fill = fill;
/**
 * Encodes given object into url-friendly format
 *
 * @param object An object that contains serializable values
 * @returns string Encoded
 */
function urlEncode(object) {
    return Object.keys(object)
        .map(
    // tslint:disable-next-line:no-unsafe-any
    function (key) { return encodeURIComponent(key) + "=" + encodeURIComponent(object[key]); })
        .join('&');
}
exports.urlEncode = urlEncode;
// Default Node.js REPL depth
var MAX_SERIALIZE_EXCEPTION_DEPTH = 3;
// 100kB, as 200kB is max payload size, so half sounds reasonable
var MAX_SERIALIZE_EXCEPTION_SIZE = 100 * 1024;
var MAX_SERIALIZE_KEYS_LENGTH = 40;
/** JSDoc */
function utf8Length(value) {
    // tslint:disable-next-line:no-bitwise
    return ~-encodeURI(value).split(/%..|./).length;
}
/** JSDoc */
function jsonSize(value) {
    return utf8Length(JSON.stringify(value));
}
/** JSDoc */
function serializeValue(value) {
    var type = Object.prototype.toString.call(value);
    // Node.js REPL notation
    if (typeof value === 'string') {
        return string_1.truncate(value, 40);
    }
    else if (type === '[object Object]') {
        return '[Object]';
    }
    else if (type === '[object Array]') {
        return '[Array]';
    }
    else {
        var normalized = normalizeValue(value);
        return is_1.isPrimitive(normalized) ? "" + normalized : type;
    }
}
/** JSDoc */
function serializeObject(value, depth) {
    if (depth === 0) {
        return serializeValue(value);
    }
    if (is_1.isPlainObject(value)) {
        var serialized_1 = {};
        var val_1 = value;
        Object.keys(val_1).forEach(function (key) {
            serialized_1[key] = serializeObject(val_1[key], depth - 1);
        });
        return serialized_1;
    }
    else if (is_1.isArray(value)) {
        var val = value;
        return val.map(function (v) { return serializeObject(v, depth - 1); });
    }
    return serializeValue(value);
}
exports.serializeObject = serializeObject;
/** JSDoc */
function limitObjectDepthToSize(object, depth, maxSize) {
    if (depth === void 0) { depth = MAX_SERIALIZE_EXCEPTION_DEPTH; }
    if (maxSize === void 0) { maxSize = MAX_SERIALIZE_EXCEPTION_SIZE; }
    var serialized = serializeObject(object, depth);
    if (jsonSize(serialize(serialized)) > maxSize) {
        return limitObjectDepthToSize(object, depth - 1);
    }
    return serialized;
}
exports.limitObjectDepthToSize = limitObjectDepthToSize;
/** JSDoc */
function serializeKeysToEventMessage(keys, maxLength) {
    if (maxLength === void 0) { maxLength = MAX_SERIALIZE_KEYS_LENGTH; }
    if (!keys.length) {
        return '[object has no keys]';
    }
    if (keys[0].length >= maxLength) {
        return string_1.truncate(keys[0], maxLength);
    }
    for (var includedKeys = keys.length; includedKeys > 0; includedKeys--) {
        var serialized = keys.slice(0, includedKeys).join(', ');
        if (serialized.length > maxLength) {
            continue;
        }
        if (includedKeys === keys.length) {
            return serialized;
        }
        return string_1.truncate(serialized, maxLength);
    }
    return '';
}
exports.serializeKeysToEventMessage = serializeKeysToEventMessage;
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
/** JSDoc */
function assign(target) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (target === null || target === undefined) {
        throw new TypeError('Cannot convert undefined or null to object');
    }
    var to = Object(target);
    // tslint:disable-next-line:prefer-for-of
    for (var i = 0; i < args.length; i++) {
        var source = args[i];
        if (source !== null) {
            for (var nextKey in source) {
                if (Object.prototype.hasOwnProperty.call(source, nextKey)) {
                    to[nextKey] = source[nextKey];
                }
            }
        }
    }
    return to;
}
exports.assign = assign;
/**
 * Transforms Error object into an object literal with all it's attributes
 * attached to it.
 *
 * Based on: https://github.com/ftlabs/js-abbreviate/blob/fa709e5f139e7770a71827b1893f22418097fbda/index.js#L95-L106
 *
 * @param error An Error containing all relevant information
 * @returns An object with all error properties
 */
function objectifyError(error) {
    // These properties are implemented as magical getters and don't show up in `for-in` loop
    var err = {
        message: error.message,
        name: error.name,
        stack: error.stack,
    };
    for (var i in error) {
        if (Object.prototype.hasOwnProperty.call(error, i)) {
            err[i] = error[i];
        }
    }
    return err;
}
/**
 * normalizeValue()
 *
 * Takes unserializable input and make it serializable friendly
 *
 * - translates undefined/NaN values to "[undefined]"/"[NaN]" respectively,
 * - serializes Error objects
 * - filter global objects
 */
function normalizeValue(value, key) {
    if (key === 'domain' && typeof value === 'object' && value._events) {
        return '[Domain]';
    }
    if (key === 'domainEmitter') {
        return '[DomainEmitter]';
    }
    if (typeof global !== 'undefined' && value === global) {
        return '[Global]';
    }
    if (typeof window !== 'undefined' && value === window) {
        return '[Window]';
    }
    if (typeof document !== 'undefined' && value === document) {
        return '[Document]';
    }
    // tslint:disable-next-line:strict-type-predicates
    if (typeof Event !== 'undefined' && value instanceof Event) {
        return Object.getPrototypeOf(value) ? value.constructor.name : 'Event';
    }
    // React's SyntheticEvent thingy
    if (is_1.isSyntheticEvent(value)) {
        return '[SyntheticEvent]';
    }
    if (is_1.isNaN(value)) {
        return '[NaN]';
    }
    if (is_1.isUndefined(value)) {
        return '[undefined]';
    }
    if (typeof value === 'function') {
        return "[Function: " + (value.name || '<unknown-function-name>') + "]";
    }
    return value;
}
/**
 * Decycles an object to make it safe for json serialization.
 *
 * @param obj Object to be decycled
 * @param memo Optional Memo class handling decycling
 */
function decycle(obj, depth, memo) {
    if (depth === void 0) { depth = +Infinity; }
    if (memo === void 0) { memo = new memo_1.Memo(); }
    if (depth === 0) {
        return serializeValue(obj);
    }
    // If an object was normalized to its string form, we should just bail out as theres no point in going down that branch
    var normalized = normalizeValue(obj);
    if (is_1.isPrimitive(normalized)) {
        return normalized;
    }
    // tslint:disable-next-line:no-unsafe-any
    var source = (is_1.isError(obj) ? objectifyError(obj) : obj);
    var copy = is_1.isArray(obj) ? [] : {};
    if (memo.memoize(obj)) {
        return '[Circular ~]';
    }
    for (var key in source) {
        // Avoid iterating over fields in the prototype if they've somehow been exposed to enumeration.
        if (!Object.prototype.hasOwnProperty.call(source, key)) {
            continue;
        }
        copy[key] = decycle(source[key], depth - 1, memo);
    }
    memo.unmemoize(obj);
    return copy;
}
exports.decycle = decycle;
/**
 * serializer()
 *
 * Remove circular references,
 * translates undefined/NaN values to "[undefined]"/"[NaN]" respectively,
 * and takes care of Error objects serialization
 */
function serializer(options) {
    if (options === void 0) { options = { normalize: true }; }
    return function (key, value) {
        // tslint:disable-next-line
        return options.normalize ? normalizeValue(decycle(value, options.depth), key) : decycle(value, options.depth);
    };
}
/**
 * safeNormalize()
 *
 * Creates a copy of the input by applying serializer function on it and parsing it back to unify the data
 */
function safeNormalize(input, depth) {
    try {
        return JSON.parse(JSON.stringify(input, serializer({ normalize: true, depth: depth })));
    }
    catch (_oO) {
        return '**non-serializable**';
    }
}
exports.safeNormalize = safeNormalize;
//# sourceMappingURL=object.js.map