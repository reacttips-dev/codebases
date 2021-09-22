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
import { color } from '../themes/utils';
export var IconStyle = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    display: flex;\n    align-items: center;\n\n    svg {\n        stroke: ", ";\n        fill: ", ";\n    }\n"], ["\n    display: flex;\n    align-items: center;\n\n    svg {\n        stroke: ", ";\n        fill: ", ";\n    }\n"])), function (props) { return color(function (c) { return c[props.strokeColor || 'inherit']; }); }, function (props) { return color(function (c) { return c[props.fillColor || 'inherit']; }); });
export var Icon = function (props) {
    var _a = __assign({ viewBox: '0 0 24 24', width: 24, onClick: function () { } }, props), className = _a.className, fillColor = _a.fillColor, onClick = _a.onClick, strokeColor = _a.strokeColor, viewBox = _a.viewBox, width = _a.width;
    return (React.createElement(IconStyle, { className: "icon", fillColor: fillColor, strokeColor: strokeColor },
        React.createElement("svg", { className: className, height: width, onClick: onClick, role: props.role, viewBox: viewBox, width: width }, props.children)));
};
var templateObject_1;
//# sourceMappingURL=Icon.js.map