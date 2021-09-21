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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyIcon = void 0;
var react_1 = __importDefault(require("react"));
function EmptyIcon(extraProps) {
    return react_1.default.createElement("svg", __assign({ xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16" }, extraProps));
}
exports.EmptyIcon = EmptyIcon;
//# sourceMappingURL=empty.js.map