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
export var ArrowDownSlimIcon = function (props) {
    var className = 'down-icon-slim';
    var viewBox = '0 0 24 24';
    var nextProps = __assign(__assign({}, props), { className: className,
        viewBox: viewBox });
    return (React.createElement(Icon, __assign({}, nextProps),
        React.createElement("g", { fillRule: "nonzero", fill: "currentColor" },
            React.createElement("path", { d: "M9.71533 9.68522C9.70988 9.69105 9.70437 9.69681 9.69879 9.70251C9.30372 10.1058 8.6706 10.0981 8.28467 9.68522L0.159216 0.992738C-0.0530721 0.765635 -0.0530721 0.397429 0.159216 0.170327C0.371504 -0.0567756 0.715692 -0.0567756 0.92798 0.170327L9 8.80564L17.072 0.170327C17.2843 -0.0567756 17.6285 -0.0567756 17.8408 0.170327C18.0531 0.397429 18.0531 0.765635 17.8408 0.992738L9.71533 9.68522Z" }))));
};
//# sourceMappingURL=ArrowDownSlimIcon.js.map