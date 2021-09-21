"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBarGeometry = exports.isPointGeometry = exports.BandedAccessorType = void 0;
exports.BandedAccessorType = Object.freeze({
    Y0: 'y0',
    Y1: 'y1',
});
function isPointGeometry(ig) {
    return ig.hasOwnProperty('radius');
}
exports.isPointGeometry = isPointGeometry;
function isBarGeometry(ig) {
    return ig.hasOwnProperty('width') && ig.hasOwnProperty('height');
}
exports.isBarGeometry = isBarGeometry;
//# sourceMappingURL=geometry.js.map