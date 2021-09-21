"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onComputedZIndex = exports.Z_INDEX_EVENT = void 0;
exports.Z_INDEX_EVENT = 'Z_INDEX_EVENT';
function onComputedZIndex(zIndex) {
    return { type: exports.Z_INDEX_EVENT, zIndex: zIndex };
}
exports.onComputedZIndex = onComputedZIndex;
//# sourceMappingURL=z_index.js.map