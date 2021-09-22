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
export var DrawerIcon = function (props) {
    var role = 'button';
    var className = 'ss-icon-hamburger';
    var nextProps = __assign(__assign({}, props), { role: role,
        className: className, viewBox: '0 0 24 24' });
    return (React.createElement(Icon, __assign({}, nextProps),
        React.createElement("path", { d: "M2 5.5C2 5.77614 2.22386 6 2.5 6H21.5C21.7761 6 22 5.77614 22 5.5C22 5.22386 21.7761 5 21.5 5H2.5C2.22386 5 2 5.22386 2 5.5ZM2.5 12C2.22386 12 2 11.7761 2 11.5C2 11.2239 2.22386 11 2.5 11H17.5C17.7761 11 18 11.2239 18 11.5C18 11.7761 17.7761 12 17.5 12H2.5ZM2.5 18C2.22386 18 2 17.7761 2 17.5C2 17.2239 2.22386 17 2.5 17H21.5C21.7761 17 22 17.2239 22 17.5C22 17.7761 21.7761 18 21.5 18H2.5Z" })));
};
//# sourceMappingURL=DrawerIcon.js.map