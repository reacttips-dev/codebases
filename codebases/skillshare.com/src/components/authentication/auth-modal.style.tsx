var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { css } from 'styled-components';
import { minWidthForScreen } from '../../themes/utils';
export var AuthModalStyle = css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    display: flex;\n\n    @media screen and (max-width: ", ") {\n        display: block;\n        border-radius: 8px;\n    }\n\n    .right-pane {\n        width: calc(100% - 284px);\n\n        @media screen and (max-width: ", ") {\n            width: 100%;\n        }\n    }\n\n    .form-wrapper {\n        padding: 60px 40px 30px;\n\n        @media screen and (max-width: ", ") {\n            padding: 32px 24px;\n        }\n    }\n"], ["\n    display: flex;\n\n    @media screen and (max-width: ", ") {\n        display: block;\n        border-radius: 8px;\n    }\n\n    .right-pane {\n        width: calc(100% - 284px);\n\n        @media screen and (max-width: ", ") {\n            width: 100%;\n        }\n    }\n\n    .form-wrapper {\n        padding: 60px 40px 30px;\n\n        @media screen and (max-width: ", ") {\n            padding: 32px 24px;\n        }\n    }\n"])), minWidthForScreen('small'), minWidthForScreen('small'), minWidthForScreen('small'));
var templateObject_1;
//# sourceMappingURL=auth-modal.style.js.map