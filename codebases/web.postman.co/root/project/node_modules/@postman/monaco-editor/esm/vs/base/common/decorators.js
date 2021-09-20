var memoizeId = 0;
export function createMemoizer() {
    var memoizeKeyPrefix = "$memoize" + memoizeId++;
    var self = undefined;
    var result = function memoize(target, key, descriptor) {
        var fnKey = null;
        var fn = null;
        if (typeof descriptor.value === 'function') {
            fnKey = 'value';
            fn = descriptor.value;
            if (fn.length !== 0) {
                console.warn('Memoize should only be used in functions with zero parameters');
            }
        }
        else if (typeof descriptor.get === 'function') {
            fnKey = 'get';
            fn = descriptor.get;
        }
        if (!fn) {
            throw new Error('not supported');
        }
        var memoizeKey = memoizeKeyPrefix + ":" + key;
        descriptor[fnKey] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            self = this;
            if (!this.hasOwnProperty(memoizeKey)) {
                Object.defineProperty(this, memoizeKey, {
                    configurable: true,
                    enumerable: false,
                    writable: true,
                    value: fn.apply(this, args)
                });
            }
            return this[memoizeKey];
        };
    };
    result.clear = function () {
        if (typeof self === 'undefined') {
            return;
        }
        Object.getOwnPropertyNames(self).forEach(function (property) {
            if (property.indexOf(memoizeKeyPrefix) === 0) {
                delete self[property];
            }
        });
    };
    return result;
}
export function memoize(target, key, descriptor) {
    return createMemoizer()(target, key, descriptor);
}
