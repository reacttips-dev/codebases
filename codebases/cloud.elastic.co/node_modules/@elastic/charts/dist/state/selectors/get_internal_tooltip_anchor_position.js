"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInternalTooltipAnchorPositionSelector = void 0;
var getInternalTooltipAnchorPositionSelector = function (state) {
    if (state.internalChartState) {
        return state.internalChartState.getTooltipAnchor(state);
    }
    return null;
};
exports.getInternalTooltipAnchorPositionSelector = getInternalTooltipAnchorPositionSelector;
//# sourceMappingURL=get_internal_tooltip_anchor_position.js.map