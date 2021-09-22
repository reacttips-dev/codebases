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
import { color, typography } from '../../../themes/utils';
export var HeaderNavLinkStyle = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    a {\n        ", "\n        cursor: pointer;\n        text-decoration: none;\n        padding: 0 9px;\n        position: relative;\n        display: inline-flex;\n        align-items: center;\n        font-weight: normal;\n        font-size: 13px;\n        white-space: no-wrap;\n    }\n\n    a.white-bold {\n        padding: 0px;\n        font-weight: bold;\n        font-size: 15px;\n        color: ", ";\n    }\n"], ["\n    a {\n        ", "\n        cursor: pointer;\n        text-decoration: none;\n        padding: 0 9px;\n        position: relative;\n        display: inline-flex;\n        align-items: center;\n        font-weight: normal;\n        font-size: 13px;\n        white-space: no-wrap;\n    }\n\n    a.white-bold {\n        padding: 0px;\n        font-weight: bold;\n        font-size: 15px;\n        color: ", ";\n    }\n"])), typography(function (t) { return t.links.nav.small; }), color(function (c) { return c.white; }));
export var HeaderNavLink = function (props) { return (React.createElement(React.Fragment, null,
    React.createElement(HeaderNavLinkStyle, null,
        React.createElement("a", __assign({}, props), props.children)))); };
var templateObject_1;
//# sourceMappingURL=nav-link.js.map