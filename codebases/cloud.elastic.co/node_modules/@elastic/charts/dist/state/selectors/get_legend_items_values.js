"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLegendExtraValuesSelector = void 0;
var EMPTY_ITEM_LIST = new Map();
var getLegendExtraValuesSelector = function (state) {
    if (state.internalChartState) {
        return state.internalChartState.getLegendExtraValues(state);
    }
    return EMPTY_ITEM_LIST;
};
exports.getLegendExtraValuesSelector = getLegendExtraValuesSelector;
//# sourceMappingURL=get_legend_items_values.js.map