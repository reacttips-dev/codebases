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
import { Icon } from '../../Icons';
import { colors } from '../../themes';
export var SavedClassIcon = function (props) {
    var role = 'button';
    var className = 'saved-class-icon';
    var viewBox = '0 0 24 24';
    var nextProps = __assign(__assign({}, props), { role: role,
        className: className,
        viewBox: viewBox });
    return (React.createElement(Icon, __assign({}, nextProps),
        React.createElement("title", null, "Class Saved"),
        React.createElement("defs", null,
            React.createElement("path", { id: "a", d: "M7 2h10a2 2 0 0 1 2 1.999v17.3a.7.7 0 0 1-1.195.495l-5.732-5.73a.1.1 0 0 0-.142 0l-5.736 5.731A.7.7 0 0 1 5 21.3V4A2 2 0 0 1 7 2z" })),
        React.createElement("g", { fill: "none", fillRule: "evenodd" },
            React.createElement("mask", { id: "b", fill: "#fff" },
                React.createElement("use", { xlinkHref: "#a" })),
            React.createElement("use", { fill: colors.charcoal, fillRule: "nonzero", xlinkHref: "#a" }),
            React.createElement("g", { fill: colors.charcoal, mask: "url(#b)" },
                React.createElement("path", { d: "M0 0h24v24H0z" })))));
};
//# sourceMappingURL=icon-saved-class.js.map