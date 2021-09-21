"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChartTypeDescriptionSelector = void 0;
var getChartTypeDescriptionSelector = function (state) {
    if (state.internalChartState) {
        return state.internalChartState.getChartTypeDescription(state);
    }
    return 'unknown chart type';
};
exports.getChartTypeDescriptionSelector = getChartTypeDescriptionSelector;
//# sourceMappingURL=get_chart_type_description.js.map