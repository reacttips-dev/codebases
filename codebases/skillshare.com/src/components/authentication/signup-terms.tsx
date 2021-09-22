var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled from 'styled-components';
import { color, typography } from '../../themes/utils';
export var SignUpTermsStyle = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    ", "\n    line-height: 16px;\n    color: ", ";\n    font-size: 13px;\n    text-align: center;\n\n    a {\n        ", "\n        color: ", ";\n        font-size: 12px;\n        font-weight: bold;\n        text-decoration: none;\n\n        &:hover {\n            text-decoration: underline;\n        }\n    }\n"], ["\n    ", "\n    line-height: 16px;\n    color: ", ";\n    font-size: 13px;\n    text-align: center;\n\n    a {\n        ", "\n        color: ", ";\n        font-size: 12px;\n        font-weight: bold;\n        text-decoration: none;\n\n        &:hover {\n            text-decoration: underline;\n        }\n    }\n"])), typography(function (t) { return t.normal; }), color(function (c) { return c.charcoal; }), typography(function (t) { return t.links.nav.small; }), color(function (c) { return c.charcoal; }));
export var SignUpTerms = function () { return (React.createElement(SignUpTermsStyle, null,
    React.createElement("p", null,
        "By signing up you agree to Skillshare's\u00A0",
        React.createElement("a", { target: "_blank", href: "/terms" }, "Terms of Service"),
        "\u00A0and\u00A0",
        React.createElement("a", { target: "_blank", href: "/privacy" }, "Privacy Policy."),
        "\u00A0This page is protected by reCAPTCHA and is subject to Google's\u00A0",
        React.createElement("a", { target: "_blank", rel: "noreferrer", href: "https://policies.google.com/terms" }, "Terms of Service"),
        "\u00A0and\u00A0",
        React.createElement("a", { target: "_blank", rel: "noreferrer", href: "https://policies.google.com/privacy" }, "Privacy Policy.")))); };
var templateObject_1;
//# sourceMappingURL=signup-terms.js.map