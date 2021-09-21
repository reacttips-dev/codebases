"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultXYLegendSeriesSort = exports.defaultXYSeriesSort = void 0;
function defaultXYSeriesSort(a, b) {
    if (a.groupId !== b.groupId) {
        return a.insertIndex - b.insertIndex;
    }
    if (a.isStacked && !b.isStacked) {
        return -1;
    }
    if (!a.isStacked && b.isStacked) {
        return 1;
    }
    return a.insertIndex - b.insertIndex;
}
exports.defaultXYSeriesSort = defaultXYSeriesSort;
function defaultXYLegendSeriesSort(a, b) {
    if (a.groupId !== b.groupId) {
        return a.insertIndex - b.insertIndex;
    }
    if (a.isStacked && !b.isStacked) {
        return -1;
    }
    if (!a.isStacked && b.isStacked) {
        return 1;
    }
    if (a.isStacked && b.isStacked) {
        return b.insertIndex - a.insertIndex;
    }
    return a.insertIndex - b.insertIndex;
}
exports.defaultXYLegendSeriesSort = defaultXYLegendSeriesSort;
//# sourceMappingURL=default_series_sort_fn.js.map