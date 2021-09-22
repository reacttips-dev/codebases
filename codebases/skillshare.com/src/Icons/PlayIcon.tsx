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
import { colors } from '../themes';
import { color } from '../themes/utils';
import { Icon } from './Icon';
var StyledIcon = styled(Icon)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    .class-card-active &,\n    &:active {\n        #triangle {\n            fill: ", ";\n        }\n    }\n"], ["\n    .class-card-active &,\n    &:active {\n        #triangle {\n            fill: ", ";\n        }\n    }\n"])), color(function (c) { return c.wanderGreen; }));
export var PlayIcon = function (props) {
    var className = 'play-icon';
    var viewBox = '0 0 40 40';
    var nextProps = __assign(__assign({}, props), { className: className,
        viewBox: viewBox });
    return (React.createElement(StyledIcon, __assign({}, nextProps),
        React.createElement("g", { fill: "none", fillRule: "nonzero" },
            React.createElement("path", { d: "M20 0.109375C9.01689 0.109375 0.113124 9.01268 0.112549 19.9958C0.111974 30.979 9.01481 39.8832 19.998 39.8844C30.9811 39.8855 39.8858 30.9832 39.8876 20C39.8876 9.01644 30.9836 0.1125 20 0.1125V0.109375Z", fill: colors.navy }),
            React.createElement("path", { id: "triangle", d: "M16.0663 11.0001C14.8479 11.0027 13.8611 12.0018 13.8594 13.2345V26.7657C13.8586 27.5643 14.2795 28.3024 14.9631 28.7016C15.6467 29.1008 16.489 29.1002 17.1721 28.7001L28.7549 21.9345C29.4383 21.5354 29.8594 20.7977 29.8594 19.9993C29.8594 19.201 29.4383 18.4633 28.7549 18.0642L17.1721 11.2985C16.8368 11.1025 16.4566 10.9991 16.0694 10.9985L16.0663 11.0001Z", fill: "white" }))));
};
var templateObject_1;
//# sourceMappingURL=PlayIcon.js.map