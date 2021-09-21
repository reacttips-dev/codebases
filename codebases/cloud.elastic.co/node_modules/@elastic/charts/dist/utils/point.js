"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDelta = void 0;
function getDelta(start, end) {
    return Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
}
exports.getDelta = getDelta;
//# sourceMappingURL=point.js.map