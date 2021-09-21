"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLegendItemsSelector = void 0;
var EMPTY_LEGEND_LIST = [];
var getLegendItemsSelector = function (state) {
    if (state.internalChartState) {
        return state.internalChartState.getLegendItems(state);
    }
    return EMPTY_LEGEND_LIST;
};
exports.getLegendItemsSelector = getLegendItemsSelector;
//# sourceMappingURL=get_legend_items.js.map