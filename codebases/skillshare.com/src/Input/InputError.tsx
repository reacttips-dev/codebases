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
import styled from 'styled-components';
import { color, typography } from '../themes/utils';
var ErrorStyle = styled.p(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    ", "\n    text-align: left;\n    border-radius: 3px;\n    color: ", ";\n    font-size: 13px;\n    font-weight: normal;\n    line-height: 18px;\n    margin-block-start: 0px;\n    margin-block-end: 0px;\n    margin-left: 25px;\n    padding: 15px 0px;\n    position: relative;\n    font-weight: bold;\n\n    &::before,\n    &::after {\n        box-sizing: border-box;\n        content: '';\n        display: inline-block;\n        position: absolute;\n    }\n\n    &::before {\n        background-color: ", ";\n        border-radius: 50%;\n        height: 20px;\n        left: -25px;\n        top: 14px;\n        width: 20px;\n    }\n\n    &::after {\n        background-color: ", ";\n        height: 4px;\n        left: -22px;\n        top: 22px;\n        width: 14px;\n    }\n"], ["\n    ", "\n    text-align: left;\n    border-radius: 3px;\n    color: ", ";\n    font-size: 13px;\n    font-weight: normal;\n    line-height: 18px;\n    margin-block-start: 0px;\n    margin-block-end: 0px;\n    margin-left: 25px;\n    padding: 15px 0px;\n    position: relative;\n    font-weight: bold;\n\n    &::before,\n    &::after {\n        box-sizing: border-box;\n        content: '';\n        display: inline-block;\n        position: absolute;\n    }\n\n    &::before {\n        background-color: ", ";\n        border-radius: 50%;\n        height: 20px;\n        left: -25px;\n        top: 14px;\n        width: 20px;\n    }\n\n    &::after {\n        background-color: ", ";\n        height: 4px;\n        left: -22px;\n        top: 22px;\n        width: 14px;\n    }\n"])), typography(function (t) { return t.normal; }), color(function (c) { return c.red; }), color(function (c) { return c.red; }), color(function (c) { return c.white; }));
export var InputError = function (_a) {
    var error = _a.error;
    var ErrorVisibility = {
        style: {
            display: error !== undefined && error.toString().trim() !== '' ? 'block' : 'none',
        },
    };
    return (React.createElement(ErrorStyle, __assign({}, ErrorVisibility, { className: "error" }), error));
};
var templateObject_1;
//# sourceMappingURL=InputError.js.map