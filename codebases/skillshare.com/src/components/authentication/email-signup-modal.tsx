var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled from 'styled-components';
import { AuthModalStyle } from './auth-modal.style';
import { EmailSignUpForm } from './email-signup-form';
import { LeftPanel } from './left-pane';
var EmailSignUpModalStyle = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    ", "\n"], ["\n    ", "\n"])), AuthModalStyle);
export var EmailSignUpModal = function (_a) {
    var data = _a.data, redirectTo = _a.redirectTo;
    return (React.createElement(EmailSignUpModalStyle, null,
        React.createElement(LeftPanel, { data: data, isEmailSignUp: true }),
        React.createElement("div", { className: "right-pane" },
            React.createElement("div", { className: "form-wrapper" },
                React.createElement(EmailSignUpForm, { redirectTo: redirectTo })))));
};
var templateObject_1;
//# sourceMappingURL=email-signup-modal.js.map