"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-unsafe-any
/**
 * Memo class used for decycle json objects. Uses WeakSet if available otherwise array.
 */
var Memo = /** @class */ (function () {
    function Memo() {
        // tslint:disable-next-line
        this.hasWeakSet = typeof WeakSet === 'function';
        this.inner = this.hasWeakSet ? new WeakSet() : [];
    }
    /**
     * Sets obj to remember.
     * @param obj Object to remember
     */
    Memo.prototype.memoize = function (obj) {
        if (this.hasWeakSet) {
            if (this.inner.has(obj)) {
                return true;
            }
            this.inner.add(obj);
            return false;
        }
        else {
            // tslint:disable-next-line:prefer-for-of
            for (var i = 0; i < this.inner.length; i++) {
                var value = this.inner[i];
                if (value === obj) {
                    return true;
                }
            }
            this.inner.push(obj);
            return false;
        }
    };
    /**
     * Removes object from internal storage.
     * @param obj Object to forget
     */
    Memo.prototype.unmemoize = function (obj) {
        if (this.hasWeakSet) {
            this.inner.delete(obj);
        }
        else {
            for (var i = 0; i < this.inner.length; i++) {
                if (this.inner[i] === obj) {
                    this.inner.splice(i, 1);
                    break;
                }
            }
        }
    };
    return Memo;
}());
exports.Memo = Memo;
//# sourceMappingURL=memo.js.map