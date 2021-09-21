"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trueBearingToStandardPositionAngle = exports.meanAngle = exports.diffAngle = exports.wrapToTau = exports.Circline = void 0;
var constants_1 = require("./constants");
var Circline = (function () {
    function Circline() {
        this.x = NaN;
        this.y = NaN;
        this.r = NaN;
    }
    return Circline;
}());
exports.Circline = Circline;
function wrapToTau(a) {
    if (0 <= a && a <= constants_1.TAU)
        return a;
    if (a < 0)
        a -= constants_1.TAU * Math.floor(a / constants_1.TAU);
    return a > constants_1.TAU ? a % constants_1.TAU : a;
}
exports.wrapToTau = wrapToTau;
function diffAngle(a, b) {
    return ((a - b + Math.PI + constants_1.TAU) % constants_1.TAU) - Math.PI;
}
exports.diffAngle = diffAngle;
function meanAngle(a, b) {
    return (constants_1.TAU + b + diffAngle(a, b) / 2) % constants_1.TAU;
}
exports.meanAngle = meanAngle;
function trueBearingToStandardPositionAngle(alphaIn) {
    return wrapToTau(constants_1.RIGHT_ANGLE - alphaIn);
}
exports.trueBearingToStandardPositionAngle = trueBearingToStandardPositionAngle;
//# sourceMappingURL=geometry.js.map