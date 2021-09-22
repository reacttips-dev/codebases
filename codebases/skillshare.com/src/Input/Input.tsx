var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { color, typography } from '../themes/utils';
var InputStyle = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    input {\n        ", "\n        border: 1px solid ", ";\n        border-radius: 4px;\n        box-sizing: border-box;\n        color: ", ";\n        cursor: text;\n        font-size: 15px;\n        height: 40px;\n        line-height: 20px;\n        padding: 0 10px 0 10px;\n        width: 100%;\n\n        &::placeholder {\n            color: ", ";\n        }\n\n        &.error,\n        &.error:focus {\n            border-color: ", "\n        }\n\n        &:focus {\n            border: 1px solid ", ";\n            outline: none;\n        }\n\n        &.bold {\n            font-weight: bold;\n        }\n    }\n\n    &::after {\n        clear: both;\n        content: '.';\n        display: block;\n        height: 0;\n        visibility: hidden;\n    }\n"], ["\n    input {\n        ", "\n        border: 1px solid ", ";\n        border-radius: 4px;\n        box-sizing: border-box;\n        color: ", ";\n        cursor: text;\n        font-size: 15px;\n        height: 40px;\n        line-height: 20px;\n        padding: 0 10px 0 10px;\n        width: 100%;\n\n        &::placeholder {\n            color: ", ";\n        }\n\n        &.error,\n        &.error:focus {\n            border-color: ", "\n        }\n\n        &:focus {\n            border: 1px solid ", ";\n            outline: none;\n        }\n\n        &.bold {\n            font-weight: bold;\n        }\n    }\n\n    &::after {\n        clear: both;\n        content: '.';\n        display: block;\n        height: 0;\n        visibility: hidden;\n    }\n"])), typography(function (t) { return t.normal; }), color(function (c) { return c.concrete; }), color(function (c) { return c.navy; }), color(function (c) { return c.charcoal; }), color(function (c) { return c.red; }), color(function (c) { return c.violet; }));
export var InputField = forwardRef(function (props, ref) {
    return (React.createElement(InputStyle, null,
        React.createElement("input", __assign({}, props, { ref: ref }))));
});
var templateObject_1;
//# sourceMappingURL=Input.js.map