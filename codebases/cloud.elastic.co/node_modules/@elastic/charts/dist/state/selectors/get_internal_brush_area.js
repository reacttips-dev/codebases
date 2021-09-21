"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInternalBrushAreaSelector = void 0;
var getInternalBrushAreaSelector = function (state) {
    if (state.internalChartState) {
        return state.internalChartState.getBrushArea(state);
    }
    return null;
};
exports.getInternalBrushAreaSelector = getInternalBrushAreaSelector;
//# sourceMappingURL=get_internal_brush_area.js.map