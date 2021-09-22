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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import { classList } from '../shared/helpers/class-list';
export var CreditCardIcon = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React.createElement(SvgIcon, __assign({ className: classList('credit-card-icon', className), width: 24, height: 24, viewBox: "0 0 24 24" }, props),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M20 6H4C3.44772 6 3 6.44772 3 7V8H21V7C21 6.44772 20.5523 6 20 6ZM3 17V10H21V17C21 17.5523 20.5523 18 20 18H4C3.44772 18 3 17.5523 3 17ZM4 5C2.89543 5 2 5.89543 2 7V17C2 18.1046 2.89543 19 4 19H20C21.1046 19 22 18.1046 22 17V7C22 5.89543 21.1046 5 20 5H4ZM4.5 12C4.22386 12 4 12.2239 4 12.5C4 12.7761 4.22386 13 4.5 13H12.5C12.7761 13 13 12.7761 13 12.5C13 12.2239 12.7761 12 12.5 12H4.5ZM4 14.5C4 14.2239 4.22386 14 4.5 14H8.5C8.77614 14 9 14.2239 9 14.5C9 14.7761 8.77614 15 8.5 15H4.5C4.22386 15 4 14.7761 4 14.5ZM17.3 12C17.1343 12 17 12.1343 17 12.3V13.7C17 13.8657 17.1343 14 17.3 14H19.7C19.8657 14 20 13.8657 20 13.7V12.3C20 12.1343 19.8657 12 19.7 12H17.3Z", fill: "#002333" })));
};
//# sourceMappingURL=CreditCardIcon.js.map