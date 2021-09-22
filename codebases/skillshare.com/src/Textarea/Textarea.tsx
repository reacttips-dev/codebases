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
import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import styled from 'styled-components';
import { color, typography } from '../themes/utils';
var TextareaStyle = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    width: 100%;\n    padding-left: 8px;\n\n    textarea {\n        ", ";\n\n        font-size: 16px;\n        min-height: 56px;\n        padding: 8px;\n        border: solid 1px ", ";\n        background-color: ", ";\n        border-radius: 4px;\n        width: 100%;\n        box-sizing: border-box;\n        resize: none;\n        -webkit-box-shadow: none;\n        -moz-box-shadow: none;\n        box-shadow: none;\n        outline: none;\n\n        &:focus {\n            border: solid 1px ", ";\n        }\n\n        &::placeholder {\n            color: ", ";\n        }\n    }\n\n    @supports (-webkit-overflow-scrolling: touch) {\n        textarea {\n            font-size: 16px;\n        }\n    }\n"], ["\n    width: 100%;\n    padding-left: 8px;\n\n    textarea {\n        ", ";\n\n        font-size: 16px;\n        min-height: 56px;\n        padding: 8px;\n        border: solid 1px ", ";\n        background-color: ", ";\n        border-radius: 4px;\n        width: 100%;\n        box-sizing: border-box;\n        resize: none;\n        -webkit-box-shadow: none;\n        -moz-box-shadow: none;\n        box-shadow: none;\n        outline: none;\n\n        &:focus {\n            border: solid 1px ", ";\n        }\n\n        &::placeholder {\n            color: ", ";\n        }\n    }\n\n    @supports (-webkit-overflow-scrolling: touch) {\n        textarea {\n            font-size: 16px;\n        }\n    }\n"])), typography(function (t) { return t.normal; }), color(function (c) { return c.concrete; }), color(function (c) { return c.white; }), color(function (c) { return c.violet; }), color(function (c) { return c.charcoal; }));
export var Textarea = function (props) {
    return (React.createElement(TextareaStyle, { className: "textarea" },
        React.createElement(TextareaAutosize, __assign({}, props))));
};
var templateObject_1;
//# sourceMappingURL=Textarea.js.map