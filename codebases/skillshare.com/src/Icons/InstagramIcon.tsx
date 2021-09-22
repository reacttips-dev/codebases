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
export var InstagramIcon = function (props) {
    var role = 'button';
    var className = 'icon-circle-instagram';
    var nextProps = __assign(__assign({}, props), { role: role,
        className: className, viewBox: '-10 -305 512 450' });
    return (React.createElement(Icon, __assign({}, nextProps),
        React.createElement("g", { transform: "scale(1, -1) translate(0, -100)" },
            React.createElement("path", { d: "M302 171c0-26-20-47-46-47-26 0-46 21-46 47 0 25 20 46 46 46 26 0 46-21 46-46z m25 0c0-39-32-71-71-71-39 0-71 32-71 71 0 5 0 9 3 14l-30 0 0-107c0-2 3-5 5-5l183 0c3 0 5 3 5 5l0 107-27 0c3-5 3-9 3-14z m-71 243c-134 0-244-109-244-243 0-134 110-244 244-244 134 0 244 110 244 244 0 134-110 243-244 243z m122-329c0-19-17-36-37-36l-170 0c-20 0-37 17-37 36l0 173c0 18 17 35 37 35l173 0c19 0 36-17 36-37l0-171z m-29 183l-30 0c-2 0-4-2-4-5l0-29c0-2 2-5 4-5l30 0c2 0 5 3 5 5l0 29c0 3-3 5-5 5z" }))));
};
//# sourceMappingURL=InstagramIcon.js.map