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
var ArrowDownStylesBrand2020 = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    svg {\n        fill: ", ";\n    }\n\n    .arrow-down-icon {\n        padding-top: 6px;\n        height: ", ";\n    }\n\n    .active {\n        fill: ", ";\n    }\n"], ["\n    svg {\n        fill: ", ";\n    }\n\n    .arrow-down-icon {\n        padding-top: 6px;\n        height: ", ";\n    }\n\n    .active {\n        fill: ", ";\n    }\n"])), color(function (c) { return c.white; }), function (props) { var _a; return ((_a = props.height) !== null && _a !== void 0 ? _a : 10) + "px"; }, color(function (c) { return c.wanderGreen; }));
export var ArrowDownIcon = function (props) {
    var ArrowDownStyles = ArrowDownStylesBrand2020;
    var role = 'button';
    var className = props.isActive ? 'arrow-down-icon active' : 'arrow-down-icon';
    var viewBox = '0 0 18 10';
    var nextProps = __assign(__assign({}, props), { role: role,
        className: className,
        viewBox: viewBox, height: 10 });
    return (React.createElement(ArrowDownStyles, { height: props.height },
        React.createElement(Icon, __assign({}, nextProps),
            React.createElement("path", { d: "M9.71533 9.68522C9.70988 9.69105 9.70437 9.69681 9.69879 9.70251C9.30372 10.1058 8.6706 10.0981 8.28467 9.68522L0.159216 0.992738C-0.0530721 0.765635 -0.0530721 0.397429 0.159216 0.170327C0.371504 -0.0567756 0.715692 -0.0567756 0.92798 0.170327L9 8.80564L17.072 0.170327C17.2843 -0.0567756 17.6285 -0.0567756 17.8408 0.170327C18.0531 0.397429 18.0531 0.765635 17.8408 0.992738L9.71533 9.68522Z" }))));
};
var templateObject_1;
//# sourceMappingURL=ArrowDownIcon.js.map