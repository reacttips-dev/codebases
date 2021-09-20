"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var error_1 = require("./error");
/** A simple queue that holds promises. */
var PromiseBuffer = /** @class */ (function () {
    function PromiseBuffer(limit) {
        this.limit = limit;
        /** Internal set of queued Promises */
        this.buffer = [];
    }
    /**
     * Says if the buffer is ready to take more requests
     */
    PromiseBuffer.prototype.isReady = function () {
        return this.limit === undefined || this.length() < this.limit;
    };
    /**
     * Add a promise to the queue.
     *
     * @param task Can be any Promise<T>
     * @returns The original promise.
     */
    PromiseBuffer.prototype.add = function (task) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                if (!this.isReady()) {
                    return [2 /*return*/, Promise.reject(new error_1.SentryError('Not adding Promise due to buffer limit reached.'))];
                }
                if (this.buffer.indexOf(task) === -1) {
                    this.buffer.push(task);
                }
                task
                    .then(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                    return [2 /*return*/, this.remove(task)];
                }); }); })
                    .catch(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    return tslib_1.__generator(this, function (_a) {
                        return [2 /*return*/, this.remove(task).catch(function () {
                                // We have to add this catch here otherwise we have an unhandledPromiseRejection
                                // because it's a new Promise chain.
                            })];
                    });
                }); });
                return [2 /*return*/, task];
            });
        });
    };
    /**
     * Remove a promise to the queue.
     *
     * @param task Can be any Promise<T>
     * @returns Removed promise.
     */
    PromiseBuffer.prototype.remove = function (task) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var removedTask;
            return tslib_1.__generator(this, function (_a) {
                removedTask = this.buffer.splice(this.buffer.indexOf(task), 1)[0];
                return [2 /*return*/, removedTask];
            });
        });
    };
    /**
     * This function returns the number of unresolved promises in the queue.
     */
    PromiseBuffer.prototype.length = function () {
        return this.buffer.length;
    };
    /**
     * This will drain the whole queue, returns true if queue is empty or drained.
     * If timeout is provided and the queue takes longer to drain, the promise still resolves but with false.
     *
     * @param timeout Number in ms to wait until it resolves with false.
     */
    PromiseBuffer.prototype.drain = function (timeout) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        var capturedSetTimeout = setTimeout(function () {
                            if (timeout && timeout > 0) {
                                resolve(false);
                            }
                        }, timeout);
                        Promise.all(_this.buffer)
                            .then(function () {
                            clearTimeout(capturedSetTimeout);
                            resolve(true);
                        })
                            .catch(function () {
                            resolve(true);
                        });
                    })];
            });
        });
    };
    return PromiseBuffer;
}());
exports.PromiseBuffer = PromiseBuffer;
//# sourceMappingURL=promisebuffer.js.map