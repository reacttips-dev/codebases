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
import { PayPalLogo } from '../../Logos';
import { CheckoutButton, SrOnly } from './checkout-button';
export var PayPalButton = function (_a) {
    var props = __rest(_a, []);
    return (React.createElement(CheckoutButton, __assign({ fgColor: "white", bgColor: "#00B7FF", hoverColor: "#009CD9" }, props),
        "Check out with",
        ' ',
        React.createElement(CheckoutButton.SvgContainer, { fgColor: "white" },
            React.createElement(SrOnly, { id: "paypal-label" }, "PayPal"),
            React.createElement(PayPalLogo, { "aria-labelledby": "paypal-label" }))));
};
//# sourceMappingURL=paypal-button.js.map