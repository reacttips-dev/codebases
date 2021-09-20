var DEFAULT_LIMIT = 10000;
var BoundedBuffer = /** @class */ (function () {
    function BoundedBuffer(limit) {
        if (limit === void 0) { limit = DEFAULT_LIMIT; }
        this.limit = limit;
        this.buffer = [];
    }
    BoundedBuffer.prototype.add = function (callback) {
        var length = this.buffer.push(callback);
        if (length > this.limit) {
            this.buffer.splice(0, 1);
        }
    };
    BoundedBuffer.prototype.drain = function () {
        this.buffer.forEach(function (callback) { return callback(); });
        this.buffer.length = 0;
    };
    return BoundedBuffer;
}());
export { BoundedBuffer };
//# sourceMappingURL=boundedBuffer.js.map