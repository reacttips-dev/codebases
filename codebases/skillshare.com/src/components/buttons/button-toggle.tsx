var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled from 'styled-components';
import { color, typography } from '../../themes/utils';
import { buttonColors, buttonStateColorStyles } from './button';
var ToggleButtonStyle = styled.label(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    display: inline-block;\n\n    span {\n        ", "\n        ", ";\n\n        color: ", ";\n        box-sizing: border-box;\n        cursor: pointer;\n        display: inline-block;\n        padding: 0 16px;\n        text-align: center;\n        vertical-align: middle;\n        white-space: nowrap;\n        height: 32px;\n        line-height: 30px;\n        border-radius: 32px !important;\n    }\n\n    &:hover span {\n        ", ";\n\n        transform: translateY(-2px);\n    }\n\n    &:active span {\n        ", ";\n    }\n\n    input {\n        display: none;\n\n        &:checked + span {\n            ", ";\n        }\n    }\n"], ["\n    display: inline-block;\n\n    span {\n        ", "\n        ", ";\n\n        color: ", ";\n        box-sizing: border-box;\n        cursor: pointer;\n        display: inline-block;\n        padding: 0 16px;\n        text-align: center;\n        vertical-align: middle;\n        white-space: nowrap;\n        height: 32px;\n        line-height: 30px;\n        border-radius: 32px !important;\n    }\n\n    &:hover span {\n        ",
    ";\n\n        transform: translateY(-2px);\n    }\n\n    &:active span {\n        ",
    ";\n    }\n\n    input {\n        display: none;\n\n        &:checked + span {\n            ",
    ";\n        }\n    }\n"])), typography(function (t) { return t.subtitle; }), buttonStateColorStyles(buttonColors.tag), color(function (c) { return c.navy; }), buttonStateColorStyles({
    textColor: color(function (c) { return c.navy; }),
    hoverFillColor: color(function (c) { return c.concrete; }),
    primaryColor: color(function (c) { return c.concrete; }),
}), buttonStateColorStyles({
    textColor: color(function (c) { return c.white; }),
    hoverFillColor: color(function (c) { return c.navy; }),
    primaryColor: color(function (c) { return c.navy; }),
}), buttonStateColorStyles({
    textColor: color(function (c) { return c.white; }),
    hoverFillColor: color(function (c) { return c.navy; }),
    primaryColor: color(function (c) { return c.navy; }),
}));
export var ToggleButton = function (props) {
    return (React.createElement(ToggleButtonStyle, null,
        React.createElement("input", { type: "checkbox" }),
        React.createElement("span", null, props.text)));
};
var templateObject_1;
//# sourceMappingURL=button-toggle.js.map