"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simple1DNoise = void 0;
var Simple1DNoise = (function () {
    function Simple1DNoise(randomNumberGenerator, maxVertices, amplitude, scale) {
        if (maxVertices === void 0) { maxVertices = 256; }
        if (amplitude === void 0) { amplitude = 5.1; }
        if (scale === void 0) { scale = 0.6; }
        this.getRandomNumber = randomNumberGenerator;
        this.maxVerticesMask = maxVertices - 1;
        this.amplitude = amplitude;
        this.scale = scale;
        this.maxVertices = maxVertices;
    }
    Simple1DNoise.prototype.getValue = function (x) {
        var _this = this;
        var r = new Array(this.maxVertices).fill(0).map(function () { return _this.getRandomNumber(0, 1, 5, true); });
        var scaledX = x * this.scale;
        var xFloor = Math.floor(scaledX);
        var t = scaledX - xFloor;
        var tRemapSmoothstep = t * t * (3 - 2 * t);
        var xMin = xFloor & this.maxVerticesMask;
        var xMax = (xMin + 1) & this.maxVerticesMask;
        var y = this.lerp(r[xMin], r[xMax], tRemapSmoothstep);
        return y * this.amplitude;
    };
    Simple1DNoise.prototype.lerp = function (a, b, t) {
        return a * (1 - t) + b * t;
    };
    return Simple1DNoise;
}());
exports.Simple1DNoise = Simple1DNoise;
//# sourceMappingURL=simple_noise.js.map