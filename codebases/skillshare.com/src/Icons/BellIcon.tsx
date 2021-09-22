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
import { Icon } from './Icon';
var BellStyleBrand2020 = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    svg {\n        fill: ", ";\n\n        &:hover {\n            fill: ", ";\n        }\n    }\n"], ["\n    svg {\n        fill: ", ";\n\n        &:hover {\n            fill: ", ";\n        }\n    }\n"])), color(function (c) { return c.white; }), color(function (c) { return c.wanderGreen; }));
export var BellIcon = function (props) {
    var BellStyle = BellStyleBrand2020;
    var className = 'bell-icon';
    var nextProps = __assign(__assign({}, props), { className: className, viewBox: '0 0 24 24' });
    return (React.createElement(BellStyle, null,
        React.createElement(Icon, __assign({}, nextProps),
            React.createElement("path", { d: "M9.004 3C4.557 3 2.379 6.496 2.487 14.053l.011.78-.753.2A1 1 0 0 0 2.004 17h14a1 1 0 0 0 .26-1.966l-.754-.201.011-.78C15.629 6.496 13.451 3 9.004 3zm0-1c5.126 0 7.632 4.022 7.517 12.067A2 2 0 0 1 16.004 18h-14a2 2 0 0 1-.517-3.933C1.372 6.022 3.877 2 9.004 2zm-1 1h2V1.973a1.001 1.001 0 0 0-2-.011V3zm1-3a2 2 0 0 1 2 2v1h-4V2a2 2 0 0 1 2-2zm1 17h-2v1.027a1 1 0 0 0 2 .011V17zm-1 3a2 2 0 0 1-2-2v-1h4v1a2 2 0 0 1-2 2z" }))));
};
var templateObject_1;
//# sourceMappingURL=BellIcon.js.map