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
export var TwitterIcon = function (props) {
    var role = 'button';
    var className = 'icon-circle-twitter';
    var nextProps = __assign(__assign({}, props), { role: role,
        className: className, viewBox: '-10 -305 512 450' });
    return (React.createElement(Icon, __assign({}, nextProps),
        React.createElement("g", { transform: "scale(1, -1) translate(0, -100)" },
            React.createElement("path", { d: "M256 414c-134 0-244-109-244-243 0-134 110-244 244-244 134 0 244 110 244 244 0 134-110 243-244 243z m95-199c0-3 0-5 0-5 0-59-44-127-127-127-24 0-48 5-68 17 2 0 7 0 10 0 22 0 39 10 56 22-20 0-37 12-42 32 3 0 5 0 8 0 5 0 7 0 12 2-20 5-37 22-37 44 5-3 13-5 20-5-12 7-20 22-20 37 0 7 3 14 5 22 22-27 54-44 93-47 0 3 0 8 0 10 0 24 19 44 44 44 12 0 24-5 31-15 10 3 20 5 30 10-3-10-5-12-15-22 10 0 10 0 20 2-3-7-10-14-20-21z" }))));
};
//# sourceMappingURL=TwitterIcon.js.map