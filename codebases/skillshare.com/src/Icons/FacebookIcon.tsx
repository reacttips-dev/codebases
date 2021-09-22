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
import { Icon } from './Icon';
export var FacebookIcon = function (props) {
    var role = 'button';
    var className = 'icon-circle-facebook';
    var nextProps = __assign(__assign({}, props), { role: role,
        className: className, viewBox: '-10 -305 512 450' });
    return (React.createElement(Icon, __assign({}, nextProps),
        React.createElement("g", { transform: "scale(1, -1) translate(0, -100)" },
            React.createElement("path", { d: "M256 414c-134 0-244-109-244-243 0-134 110-244 244-244 134 0 244 110 244 244 0 134-110 243-244 243z m51-243l-31 0 0-120-49 0 0 120-25 0 0 41 25 0 0 24c0 35 14 54 53 54l32 0 0-41-19 0c-15 0-17-5-17-17l0-20 36 0z" }))));
};
//# sourceMappingURL=FacebookIcon.js.map