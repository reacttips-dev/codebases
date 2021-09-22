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
export var SaveClassIcon = function (props) {
    var role = 'button';
    var className = 'save-class-icon';
    var viewBox = '0 0 24 24';
    var nextProps = __assign(__assign({}, props), { role: role,
        className: className,
        viewBox: viewBox });
    return (React.createElement(Icon, __assign({}, nextProps),
        React.createElement("title", null, "Save Class"),
        React.createElement("g", { fill: "none", fillRule: "nonzero" },
            React.createElement("path", { fill: colors.charcoal, d: "M6 20.586l5.224-5.223a1.1 1.1 0 0 1 1.556 0L18 20.586V4a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v16.586zM7 2h10a2 2 0 0 1 2 2v17.31a.7.7 0 0 1-1.195.495l-5.732-5.734a.1.1 0 0 0-.142 0l-5.736 5.734A.7.7 0 0 1 5 21.31V4a2 2 0 0 1 2-2z" }))));
};
//# sourceMappingURL=icon-save-class.js.map