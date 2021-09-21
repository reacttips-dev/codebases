"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onKeyPress = exports.ON_KEY_UP = void 0;
exports.ON_KEY_UP = 'ON_KEY_UP';
function onKeyPress(key) {
    return { type: exports.ON_KEY_UP, key: key };
}
exports.onKeyPress = onKeyPress;
//# sourceMappingURL=key.js.map