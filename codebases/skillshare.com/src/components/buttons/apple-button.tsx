var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled from 'styled-components';
import { color, typography } from '../../themes/utils';
import { buttonColors, buttonStyle } from './button';
var ButtonStyle = styled.button(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    ", "\n\n    box-shadow: 0 1px 0 0 ", ";\n    width: 100%;\n    height: 40px;\n    cursor: pointer;\n    border: 1px solid ", ";\n    border-radius: 4px;\n\n    svg {\n        position: absolute;\n        top: 11px;\n        left: 11px;\n        width: 18px;\n        height: 18px;\n        display: inline-block;\n    }\n\n    .text {\n        ", "\n        font-size: 15px;\n        line-height: 19.2px;\n        font-weight: bold;\n        letter-spacing: 0.2px;\n        color: ", ";\n        display: flex;\n        align-items: flex-end;\n        position: absolute;\n        left: 80px;\n        top: 10px;\n    }\n\n    &:active {\n        transform: translateY(1px);\n    }\n\n    &:hover {\n        border-color: ", ";\n    }\n"], ["\n    ", "\n\n    box-shadow: 0 1px 0 0 ", ";\n    width: 100%;\n    height: 40px;\n    cursor: pointer;\n    border: 1px solid ", ";\n    border-radius: 4px;\n\n    svg {\n        position: absolute;\n        top: 11px;\n        left: 11px;\n        width: 18px;\n        height: 18px;\n        display: inline-block;\n    }\n\n    .text {\n        ", "\n        font-size: 15px;\n        line-height: 19.2px;\n        font-weight: bold;\n        letter-spacing: 0.2px;\n        color: ", ";\n        display: flex;\n        align-items: flex-end;\n        position: absolute;\n        left: 80px;\n        top: 10px;\n    }\n\n    &:active {\n        transform: translateY(1px);\n    }\n\n    &:hover {\n        border-color: ", ";\n    }\n"])), buttonStyle(buttonColors.white), color(function (c) { return c.concrete; }), color(function (c) { return c.charcoal; }), typography(function (t) { return t.normal; }), color(function (c) { return c.navy; }), color(function (c) { return c.navy; }));
export var AppleButton = function (_a) {
    var text = _a.text, onClick = _a.onClick;
    return (React.createElement(ButtonStyle, { className: "apple-button", onClick: onClick },
        React.createElement(AppleLogo, null),
        React.createElement("span", { className: "text" }, text)));
};
var AppleLogo = function () { return (React.createElement("svg", { width: "18", height: "18", viewBox: "0 -1 16 22", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("path", { d: "M16 14.673C15.3712 16.573 13.4888 19.9373 11.5496 19.974C10.2632 19.9998 9.8496 19.1798 8.3792 19.1798C6.9096 19.1798 6.4496 19.949 5.2336 19.999C3.176 20.0815 0 15.143 0 10.8362C0 6.88022 2.6464 4.91933 4.9584 4.88349C6.1984 4.86016 7.3696 5.75435 8.1256 5.75435C8.8848 5.75435 10.3072 4.67932 11.8024 4.83682C12.428 4.86432 14.1856 5.09933 15.3136 6.81772C12.3208 8.85279 12.7872 13.1088 16 14.673ZM11.8224 0C9.5616 0.0950031 7.7168 2.56592 7.9744 4.60932C10.064 4.77849 12.0688 2.33841 11.8224 0Z", fill: "black" }))); };
var templateObject_1;
//# sourceMappingURL=apple-button.js.map