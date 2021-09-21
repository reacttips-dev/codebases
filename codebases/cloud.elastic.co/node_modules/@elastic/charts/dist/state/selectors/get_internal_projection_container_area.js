"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInternalProjectionContainerAreaSelector = void 0;
var getInternalProjectionContainerAreaSelector = function (state) {
    if (state.internalChartState) {
        return state.internalChartState.getProjectionContainerArea(state);
    }
    return { width: 0, height: 0, left: 0, top: 0 };
};
exports.getInternalProjectionContainerAreaSelector = getInternalProjectionContainerAreaSelector;
//# sourceMappingURL=get_internal_projection_container_area.js.map