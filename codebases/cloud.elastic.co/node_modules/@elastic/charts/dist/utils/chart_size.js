"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChartSize = void 0;
function getChartSize(size) {
    if (size === undefined) {
        return {};
    }
    if (Array.isArray(size)) {
        return {
            width: size[0] === undefined ? '100%' : size[0],
            height: size[1] === undefined ? '100%' : size[1],
        };
    }
    if (typeof size === 'object') {
        return {
            width: size.width === undefined ? '100%' : size.width,
            height: size.height === undefined ? '100%' : size.height,
        };
    }
    var sameSize = size === undefined ? '100%' : size;
    return {
        width: sameSize,
        height: sameSize,
    };
}
exports.getChartSize = getChartSize;
//# sourceMappingURL=chart_size.js.map