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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React from 'react';
import styled from 'styled-components';
import { Button, useTheme } from '@material-ui/core';
var LabelStyled = styled.span(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    font-size: ", "px;\n    font-weight: bold;\n    top: ", "px;\n    color: ", ";\n"], ["\n    font-size: ", "px;\n    font-weight: bold;\n    top: ", "px;\n    color: ", ";\n"])), function (props) { return props.mui.spacing(1.875); }, function (props) { return props.mui.spacing(1.25); }, function (props) { return props.fgColor || props.mui.palette.secondary.main; });
var Label = function (_a) {
    var children = _a.children, props = __rest(_a, ["children"]);
    var muiTheme = useTheme();
    return (React.createElement(LabelStyled, __assign({ mui: muiTheme }, props), children));
};
var SvgContainerStyled = styled.span(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    svg {\n        top: ", "px;\n        width: ", "px;\n        display: inline-block;\n        fill: none;\n        path {\n            fill: ", ";\n            stroke: ", ";\n        }\n    }\n"], ["\n    svg {\n        top: ", "px;\n        width: ", "px;\n        display: inline-block;\n        fill: none;\n        path {\n            fill: ", ";\n            stroke: ", ";\n        }\n    }\n"])), function (props) { return props.mui.spacing(1.25); }, function (props) { return props.mui.spacing(10.25); }, function (props) { return props.fgColor || props.mui.palette.secondary.main; }, function (props) { return props.fgColor || props.mui.palette.secondary.main; });
var SvgContainer = function (_a) {
    var children = _a.children, props = __rest(_a, ["children"]);
    var muiTheme = useTheme();
    return (React.createElement(SvgContainerStyled, __assign({ mui: muiTheme }, props), children));
};
export var SrOnly = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    clip: rect(0 0 0 0);\n    clip-path: inset(50%);\n    height: 1px;\n    overflow: hidden;\n    position: absolute;\n    white-space: nowrap;\n    width: 1px;\n"], ["\n    clip: rect(0 0 0 0);\n    clip-path: inset(50%);\n    height: 1px;\n    overflow: hidden;\n    position: absolute;\n    white-space: nowrap;\n    width: 1px;\n"])));
var CheckoutButtonStyled = styled(function (_a) {
    var fgColor = _a.fgColor, bgColor = _a.bgColor, hoverColor = _a.hoverColor, disabledColor = _a.disabledColor, props = __rest(_a, ["fgColor", "bgColor", "hoverColor", "disabledColor"]);
    return (React.createElement(Button, __assign({}, props)));
})(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    && {\n        font-family: ", ";\n        line-height: ", ";\n        text-transform: ", ";\n        color: ", ";\n        font-size: ", "px;\n        height: ", "px;\n        padding: ", ";\n        min-width: ", "px;\n        box-sizing: border-box;\n        border-radius: 4px;\n        background-color: ", " !important;\n        border: 1px solid ", ";\n        :hover {\n            background-color: ", " !important;\n            border-color: ", ";\n        }\n        :disabled {\n            background-color: ", " !important;\n            border-color: ", ";\n            color: rgba(0, 0, 0, 0.26);\n        }\n        .MuiButton-label {\n            display: grid;\n            gap: ", "px;\n            grid-auto-flow: column;\n            align-items: center;\n            justify-items: center;\n            // TODO: Get font-weight, and font-size from mui theme\n            font-weight: 700;\n            font-size: 18px;\n        }\n    }\n"], ["\n    && {\n        font-family: ", ";\n        line-height: ", ";\n        text-transform: ", ";\n        color: ", ";\n        font-size: ", "px;\n        height: ", "px;\n        padding: ", ";\n        min-width: ", "px;\n        box-sizing: border-box;\n        border-radius: 4px;\n        background-color: ", " !important;\n        border: 1px solid ", ";\n        :hover {\n            background-color: ", " !important;\n            border-color: ", ";\n        }\n        :disabled {\n            background-color: ", " !important;\n            border-color: ", ";\n            color: rgba(0, 0, 0, 0.26);\n        }\n        .MuiButton-label {\n            display: grid;\n            gap: ", "px;\n            grid-auto-flow: column;\n            align-items: center;\n            justify-items: center;\n            // TODO: Get font-weight, and font-size from mui theme\n            font-weight: 700;\n            font-size: 18px;\n        }\n    }\n"])), function (props) { return props.mui.typography.button.fontFamily; }, function (props) { return props.mui.typography.button.lineHeight; }, function (props) { return props.mui.typography.button.textTransform; }, function (props) { return props.fgColor || props.mui.palette.secondary.main; }, function (props) { return props.mui.spacing(1.875); }, function (props) { return props.mui.spacing(5); }, function (props) { return props.mui.spacing(1, 2); }, function (props) { return props.mui.spacing(12); }, function (props) { return (props.bgColor ? props.bgColor : props.mui.palette.common.white); }, function (props) { return (props.bgColor ? props.bgColor : props.mui.palette.common.white); }, function (props) { return (props.hoverColor ? props.hoverColor : '#D9D9D9'); }, function (props) { return props.hoverColor || '#D9D9D9'; }, function (props) { return props.disabledColor || '#DCDEE1'; }, function (props) { return props.disabledColor || '#DCDEE1'; }, function (props) { return props.mui.spacing(1); });
export var CheckoutButton = function (_a) {
    var children = _a.children, props = __rest(_a, ["children"]);
    var muiTheme = useTheme();
    return (React.createElement(CheckoutButtonStyled, __assign({ type: "button", mui: muiTheme }, props), children));
};
CheckoutButton.Label = Label;
CheckoutButton.SvgContainer = SvgContainer;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=checkout-button.js.map