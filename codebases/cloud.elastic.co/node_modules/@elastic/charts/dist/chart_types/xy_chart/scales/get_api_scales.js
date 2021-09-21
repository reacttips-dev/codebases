"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYNiceFromSpec = exports.getYScaleTypeFromSpec = exports.getXNiceFromSpec = exports.getXScaleTypeFromSpec = void 0;
var scale_defaults_1 = require("./scale_defaults");
function getXScaleTypeFromSpec(type) {
    return type !== null && type !== void 0 ? type : scale_defaults_1.X_SCALE_DEFAULT.type;
}
exports.getXScaleTypeFromSpec = getXScaleTypeFromSpec;
function getXNiceFromSpec(nice) {
    return nice !== null && nice !== void 0 ? nice : scale_defaults_1.X_SCALE_DEFAULT.nice;
}
exports.getXNiceFromSpec = getXNiceFromSpec;
function getYScaleTypeFromSpec(type) {
    return type !== null && type !== void 0 ? type : scale_defaults_1.Y_SCALE_DEFAULT.type;
}
exports.getYScaleTypeFromSpec = getYScaleTypeFromSpec;
function getYNiceFromSpec(nice) {
    return nice !== null && nice !== void 0 ? nice : scale_defaults_1.Y_SCALE_DEFAULT.nice;
}
exports.getYNiceFromSpec = getYNiceFromSpec;
//# sourceMappingURL=get_api_scales.js.map