"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInternalIsBrushingSelector = void 0;
var getInternalIsBrushingSelector = function (state) {
    if (state.internalChartState) {
        return state.internalChartState.isBrushing(state);
    }
    return false;
};
exports.getInternalIsBrushingSelector = getInternalIsBrushingSelector;
//# sourceMappingURL=get_internal_is_brushing.js.map