"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInternalPointerCursor = void 0;
var constants_1 = require("../../common/constants");
var getInternalPointerCursor = function (state) {
    var _a, _b;
    return (_b = (_a = state.internalChartState) === null || _a === void 0 ? void 0 : _a.getPointerCursor(state)) !== null && _b !== void 0 ? _b : constants_1.DEFAULT_CSS_CURSOR;
};
exports.getInternalPointerCursor = getInternalPointerCursor;
//# sourceMappingURL=get_internal_cursor_pointer.js.map