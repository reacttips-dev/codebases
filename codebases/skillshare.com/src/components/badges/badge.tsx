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
import { color, typography } from '../../themes/utils';
var BadgeStyle = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    ", "\n\n    .badge {\n        align-items: center;\n        background-color: ", ";\n        border-radius: 4px;\n        display: inline-flex;\n        line-height: 20px;\n        padding: 0 8px 0 8px;\n\n        &.with-icon {\n            padding: 0 8px 0 5px;\n\n            span {\n                padding-left: 2px;\n            }\n\n            .top-teacher-icon {\n                display: flex;\n            }\n        }\n    }\n\n    span {\n        color: ", ";\n        font-size: 13px;\n        font-weight: bold;\n    }\n"], ["\n    ", "\n\n    .badge {\n        align-items: center;\n        background-color: ", ";\n        border-radius: 4px;\n        display: inline-flex;\n        line-height: 20px;\n        padding: 0 8px 0 8px;\n\n        &.with-icon {\n            padding: 0 8px 0 5px;\n\n            span {\n                padding-left: 2px;\n            }\n\n            .top-teacher-icon {\n                display: flex;\n            }\n        }\n    }\n\n    span {\n        color: ", ";\n        font-size: 13px;\n        font-weight: bold;\n    }\n"])), typography(function (t) { return t.normal; }), function (props) { return props.primaryColor; }, function (props) { return props.textColor; });
export var Badge = function (props) {
    var _a = __assign({ primaryColor: color(function (c) { return c.navy; }), className: '', textColor: color(function (c) { return c.wanderGreen; }) }, props), className = _a.className, primaryColor = _a.primaryColor, textColor = _a.textColor;
    var classNames = ['badge', className];
    if (props.icon) {
        classNames.push('with-icon');
    }
    return (React.createElement(BadgeStyle, { primaryColor: primaryColor, textColor: textColor },
        React.createElement("div", { className: "" + classNames.join(' ') },
            props.icon,
            React.createElement("span", null, props.text))));
};
var templateObject_1;
//# sourceMappingURL=badge.js.map