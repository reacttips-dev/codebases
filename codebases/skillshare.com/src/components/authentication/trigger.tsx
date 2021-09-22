var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled from 'styled-components';
import { Button } from '../buttons';
import { HeaderNavLink } from '../header/nav-link';
import { ButtonType } from './controller';
var ButtonStyle = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    button:focus {\n        top: 0px;\n        outline: none;\n    }\n\n    button:active {\n        top: 0px;\n        outline: none;\n    }\n"], ["\n    button:focus {\n        top: 0px;\n        outline: none;\n    }\n\n    button:active {\n        top: 0px;\n        outline: none;\n    }\n"])));
export var ModalTrigger = function (_a) {
    var buttonType = _a.buttonType, buttonText = _a.buttonText, buttonClass = _a.buttonClass, openModal = _a.openModal;
    return buttonType === ButtonType.Link ? (React.createElement(HeaderNavLink, { onClick: openModal, className: buttonClass },
        React.createElement("span", null, buttonText))) : (React.createElement(ButtonStyle, null,
        React.createElement(Button, { text: buttonText, onClick: openModal, className: buttonClass })));
};
var templateObject_1;
//# sourceMappingURL=trigger.js.map