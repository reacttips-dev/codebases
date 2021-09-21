"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInternalTooltipInfoSelector = void 0;
var getInternalTooltipInfoSelector = function (state) {
    if (state.internalChartState) {
        return state.internalChartState.getTooltipInfo(state);
    }
};
exports.getInternalTooltipInfoSelector = getInternalTooltipInfoSelector;
//# sourceMappingURL=get_internal_tooltip_info.js.map