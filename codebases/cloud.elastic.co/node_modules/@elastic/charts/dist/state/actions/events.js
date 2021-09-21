"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onExternalPointerEvent = exports.EXTERNAL_POINTER_EVENT = void 0;
exports.EXTERNAL_POINTER_EVENT = 'EXTERNAL_POINTER_EVENT';
function onExternalPointerEvent(event) {
    return { type: exports.EXTERNAL_POINTER_EVENT, event: event };
}
exports.onExternalPointerEvent = onExternalPointerEvent;
//# sourceMappingURL=events.js.map