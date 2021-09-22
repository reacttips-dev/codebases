var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled from 'styled-components';
import { Avatar, AvatarSizes } from '../../Avatar';
import { color, minWidthForScreen, typography } from '../../themes/utils';
var LeftPaneStyle = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    display: -ms-flexbox;\n    display: flex;\n    -ms-flex-align: stretch;\n    align-items: stretch;\n    background-repeat: no-repeat;\n    background-size: cover;\n    border-radius: 3px 0 0 3px;\n    background-color: ", ";\n    width: 284px;\n\n    @media screen and (max-width: ", ") {\n        border-radius: 8px 0 0 8px;\n    }\n\n    @media screen and (max-width: ", ") {\n        display: block;\n        width: 100%;\n        border-radius: 8px 8px 0 0;\n    }\n\n    .overlay {\n        align-items: center;\n        width: 100%;\n        margin: auto 0 auto 0;\n    }\n\n    .content {\n        h2 {\n            ", "\n            font-weight: bold;\n            color: ", ";\n        }\n\n        h4 {\n            ", "\n            font-weight: normal;\n            color: ", ";\n\n            &.name {\n                font-weight: bold;\n            }\n        }\n\n        img {\n            @media screen and (max-width: ", ") {\n                width: 72px;\n            }\n        }\n\n        padding: 30px;\n\n        @media screen and (max-width: ", ") {\n            padding: 32px 32px 24px;\n        }\n    }\n\n    .separator {\n        height: 0;\n        width: 100px;\n        margin: 24px 0;\n        border-radius: 8px;\n        border: 4px solid ", ";\n    }\n"], ["\n    display: -ms-flexbox;\n    display: flex;\n    -ms-flex-align: stretch;\n    align-items: stretch;\n    background-repeat: no-repeat;\n    background-size: cover;\n    border-radius: 3px 0 0 3px;\n    background-color: ", ";\n    width: 284px;\n\n    @media screen and (max-width: ", ") {\n        border-radius: 8px 0 0 8px;\n    }\n\n    @media screen and (max-width: ", ") {\n        display: block;\n        width: 100%;\n        border-radius: 8px 8px 0 0;\n    }\n\n    .overlay {\n        align-items: center;\n        width: 100%;\n        margin: auto 0 auto 0;\n    }\n\n    .content {\n        h2 {\n            ", "\n            font-weight: bold;\n            color: ", ";\n        }\n\n        h4 {\n            ", "\n            font-weight: normal;\n            color: ", ";\n\n            &.name {\n                font-weight: bold;\n            }\n        }\n\n        img {\n            @media screen and (max-width: ", ") {\n                width: 72px;\n            }\n        }\n\n        padding: 30px;\n\n        @media screen and (max-width: ", ") {\n            padding: 32px 32px 24px;\n        }\n    }\n\n    .separator {\n        height: 0;\n        width: 100px;\n        margin: 24px 0;\n        border-radius: 8px;\n        border: 4px solid ", ";\n    }\n"])), color(function (c) { return c.navy; }), minWidthForScreen('medium'), minWidthForScreen('small'), typography(function (t) { return t.h2; }), color(function (c) { return c.white; }), typography(function (t) { return t.h4; }), color(function (c) { return c.white; }), minWidthForScreen('small'), minWidthForScreen('small'), color(function (c) { return c.wanderGreen; }));
export var LeftPanel = function (_a) {
    var data = _a.data, _b = _a.isEmailSignUp, isEmailSignUp = _b === void 0 ? false : _b;
    return (React.createElement(LeftPaneStyle, null,
        React.createElement("div", { className: "overlay" },
            React.createElement("div", { className: "content" }, isEmailSignUp && data.userProfile ? (React.createElement(React.Fragment, null,
                React.createElement(Avatar, { size: AvatarSizes.XLarge, src: data.userProfile.picture }),
                React.createElement("h2", null, data.headerText),
                React.createElement("div", { className: "separator" }),
                React.createElement("h4", null, data.subHeaderText))) : (React.createElement("span", null,
                React.createElement("h2", null, data.headerText),
                React.createElement("div", { className: "separator" }),
                React.createElement("h4", null, data.subHeaderText)))))));
};
var templateObject_1;
//# sourceMappingURL=left-pane.js.map