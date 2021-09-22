var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { TrackableEvents } from '../../shared';
import { useEventTracker } from '../../shared/hooks';
import { AuthModalStyle } from './auth-modal.style';
import { LeftPanel } from './left-pane';
import { LoginForm } from './login-form';
var LoginModalStyle = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    ", "\n"], ["\n    ", "\n"])), AuthModalStyle);
export var LoginModal = function (_a) {
    var data = _a.data, redirectTo = _a.redirectTo;
    var trackEvent = useEventTracker().trackEvent;
    useEffect(function () {
        trackEvent(TrackableEvents.ViewSignIn, { type: 'popup' });
    }, []);
    return (React.createElement(LoginModalStyle, null,
        React.createElement(LeftPanel, { data: {
                headerText: data.headerText,
                subHeaderText: data.subHeaderText,
            } }),
        React.createElement("div", { className: "right-pane" },
            React.createElement("div", { className: "form-wrapper" },
                React.createElement(LoginForm, { redirectTo: redirectTo })))));
};
var templateObject_1;
//# sourceMappingURL=login-modal.js.map