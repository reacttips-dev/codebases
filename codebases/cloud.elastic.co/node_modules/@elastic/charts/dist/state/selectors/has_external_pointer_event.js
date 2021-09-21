"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasExternalEventSelector = void 0;
var specs_1 = require("../../specs");
var hasExternalEventSelector = function (_a) {
    var pointer = _a.externalEvents.pointer;
    return pointer !== null && pointer.type !== specs_1.PointerEventType.Out;
};
exports.hasExternalEventSelector = hasExternalEventSelector;
//# sourceMappingURL=has_external_pointer_event.js.map