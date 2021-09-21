"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isContinuousScale = exports.isBandScale = exports.isLogarithmicScale = void 0;
var constants_1 = require("./constants");
function isLogarithmicScale(scale) {
    return scale.type === constants_1.ScaleType.Log;
}
exports.isLogarithmicScale = isLogarithmicScale;
function isBandScale(scale) {
    return scale.type === constants_1.ScaleType.Ordinal;
}
exports.isBandScale = isBandScale;
function isContinuousScale(scale) {
    return scale.type !== constants_1.ScaleType.Ordinal;
}
exports.isContinuousScale = isContinuousScale;
//# sourceMappingURL=types.js.map