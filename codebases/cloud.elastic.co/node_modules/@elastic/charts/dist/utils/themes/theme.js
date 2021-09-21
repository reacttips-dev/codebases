"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextureShape = exports.PointShape = void 0;
exports.PointShape = Object.freeze({
    Circle: 'circle',
    Square: 'square',
    Diamond: 'diamond',
    Plus: 'plus',
    X: 'x',
    Triangle: 'triangle',
});
exports.TextureShape = Object.freeze(__assign(__assign({}, exports.PointShape), { Line: 'line' }));
//# sourceMappingURL=theme.js.map