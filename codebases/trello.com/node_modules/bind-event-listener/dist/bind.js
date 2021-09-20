"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bind = void 0;
function bind(target, _a) {
    var type = _a.type, listener = _a.listener, options = _a.options;
    target.addEventListener(type, listener, options);
    return function unbind() {
        target.removeEventListener(type, listener, options);
    };
}
exports.bind = bind;
