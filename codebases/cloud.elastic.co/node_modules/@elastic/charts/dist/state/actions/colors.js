"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPersistedColor = exports.setTemporaryColor = exports.clearTemporaryColors = exports.SET_PERSISTED_COLOR = exports.SET_TEMPORARY_COLOR = exports.CLEAR_TEMPORARY_COLORS = void 0;
exports.CLEAR_TEMPORARY_COLORS = 'CLEAR_TEMPORARY_COLORS';
exports.SET_TEMPORARY_COLOR = 'SET_TEMPORARY_COLOR';
exports.SET_PERSISTED_COLOR = 'SET_PERSISTED_COLOR';
function clearTemporaryColors() {
    return { type: exports.CLEAR_TEMPORARY_COLORS };
}
exports.clearTemporaryColors = clearTemporaryColors;
function setTemporaryColor(keys, color) {
    return { type: exports.SET_TEMPORARY_COLOR, keys: keys, color: color };
}
exports.setTemporaryColor = setTemporaryColor;
function setPersistedColor(keys, color) {
    return { type: exports.SET_PERSISTED_COLOR, keys: keys, color: color };
}
exports.setPersistedColor = setPersistedColor;
//# sourceMappingURL=colors.js.map