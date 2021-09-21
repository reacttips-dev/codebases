"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInternalMainProjectionAreaSelector = void 0;
var getInternalMainProjectionAreaSelector = function (state) {
    if (state.internalChartState) {
        return state.internalChartState.getMainProjectionArea(state);
    }
    return { width: 0, height: 0, left: 0, top: 0 };
};
exports.getInternalMainProjectionAreaSelector = getInternalMainProjectionAreaSelector;
//# sourceMappingURL=get_internal_main_projection_area.js.map