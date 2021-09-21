"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurveFactory = exports.CurveType = void 0;
var d3_shape_1 = require("d3-shape");
exports.CurveType = Object.freeze({
    CURVE_CARDINAL: 0,
    CURVE_NATURAL: 1,
    CURVE_MONOTONE_X: 2,
    CURVE_MONOTONE_Y: 3,
    CURVE_BASIS: 4,
    CURVE_CATMULL_ROM: 5,
    CURVE_STEP: 6,
    CURVE_STEP_AFTER: 7,
    CURVE_STEP_BEFORE: 8,
    LINEAR: 9,
});
function getCurveFactory(curveType) {
    if (curveType === void 0) { curveType = exports.CurveType.LINEAR; }
    switch (curveType) {
        case exports.CurveType.CURVE_CARDINAL:
            return d3_shape_1.curveCardinal;
        case exports.CurveType.CURVE_NATURAL:
            return d3_shape_1.curveNatural;
        case exports.CurveType.CURVE_MONOTONE_X:
            return d3_shape_1.curveMonotoneX;
        case exports.CurveType.CURVE_MONOTONE_Y:
            return d3_shape_1.curveMonotoneY;
        case exports.CurveType.CURVE_BASIS:
            return d3_shape_1.curveBasis;
        case exports.CurveType.CURVE_CATMULL_ROM:
            return d3_shape_1.curveCatmullRom;
        case exports.CurveType.CURVE_STEP:
            return d3_shape_1.curveStep;
        case exports.CurveType.CURVE_STEP_AFTER:
            return d3_shape_1.curveStepAfter;
        case exports.CurveType.CURVE_STEP_BEFORE:
            return d3_shape_1.curveStepBefore;
        case exports.CurveType.LINEAR:
        default:
            return d3_shape_1.curveLinear;
    }
}
exports.getCurveFactory = getCurveFactory;
//# sourceMappingURL=curves.js.map