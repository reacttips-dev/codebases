"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreenReaderDescription = void 0;
var react_1 = __importDefault(require("react"));
function ScreenReaderDescription(props) {
    if (!props.description)
        return null;
    return react_1.default.createElement("p", { id: props.descriptionId }, props.description);
}
exports.ScreenReaderDescription = ScreenReaderDescription;
//# sourceMappingURL=description.js.map