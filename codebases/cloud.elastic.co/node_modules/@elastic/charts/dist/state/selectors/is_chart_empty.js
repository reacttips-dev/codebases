"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInternalChartEmptySelector = void 0;
var isInternalChartEmptySelector = function (state) {
    if (state.internalChartState) {
        return state.internalChartState.isChartEmpty(state);
    }
};
exports.isInternalChartEmptySelector = isInternalChartEmptySelector;
//# sourceMappingURL=is_chart_empty.js.map