"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInternalIsInitializedSelector = exports.InitStatus = void 0;
exports.InitStatus = Object.freeze({
    ParentSizeInvalid: 'ParentSizeInvalid',
    SpecNotInitialized: 'SpecNotInitialized',
    MissingChartType: 'MissingChartType',
    ChartNotInitialized: 'ChartNotInitialized',
    Initialized: 'Initialized',
});
var getInternalIsInitializedSelector = function (state) {
    var _a = state.parentDimensions, width = _a.width, height = _a.height, specsInitialized = state.specsInitialized, internalChartState = state.internalChartState;
    if (!specsInitialized) {
        return exports.InitStatus.SpecNotInitialized;
    }
    if (!internalChartState) {
        return exports.InitStatus.MissingChartType;
    }
    if (width <= 0 || height <= 0) {
        return exports.InitStatus.ParentSizeInvalid;
    }
    return internalChartState.isInitialized(state);
};
exports.getInternalIsInitializedSelector = getInternalIsInitializedSelector;
//# sourceMappingURL=get_internal_is_intialized.js.map