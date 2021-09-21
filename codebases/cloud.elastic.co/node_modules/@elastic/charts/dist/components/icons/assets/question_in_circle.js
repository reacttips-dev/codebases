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
exports.QuestionInCircle = void 0;
var react_1 = __importDefault(require("react"));
function QuestionInCircle(extraProps) {
    return (react_1.default.createElement("svg", __assign({ xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16" }, extraProps),
        react_1.default.createElement("path", { d: "M8 14A6 6 0 1 1 8 2a6 6 0 0 1 0 12zm0-1A5 5 0 1 0 8 3a5 5 0 0 0 0 10zm-.186-1.065A.785.785 0 0 1 7 11.12c0-.48.34-.82.814-.82.475 0 .809.34.809.82 0 .475-.334.815-.809.815zM5.9 6.317C5.96 5.168 6.755 4.4 8.048 4.4c1.218 0 2.091.759 2.091 1.8 0 .736-.36 1.304-1.03 1.707-.56.33-.717.56-.717 1.022v.305l-.1.1H7.47l-.1-.1v-.431c-.005-.646.302-1.104.987-1.514.527-.322.708-.59.708-1.047 0-.536-.416-.91-1.05-.91-.652 0-1.064.374-1.112.998l-.1.092H6l-.1-.105z" })));
}
exports.QuestionInCircle = QuestionInCircle;
//# sourceMappingURL=question_in_circle.js.map