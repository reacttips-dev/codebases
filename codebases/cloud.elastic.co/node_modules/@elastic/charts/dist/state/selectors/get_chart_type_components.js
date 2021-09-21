"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInternalChartRendererSelector = void 0;
var getInternalChartRendererSelector = function (state) {
    if (state.internalChartState) {
        return state.internalChartState.chartRenderer;
    }
    return function () { return null; };
};
exports.getInternalChartRendererSelector = getInternalChartRendererSelector;
//# sourceMappingURL=get_chart_type_components.js.map