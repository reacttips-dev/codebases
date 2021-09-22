var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled from 'styled-components';
import { color, typography } from '../themes/utils';
var SmallcapsTitleStyle = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    ", "\n\n    color: ", ";\n    font-size: 12px;\n    letter-spacing: 1px;\n    margin-bottom: 16px;\n    text-transform: uppercase;\n"], ["\n    ", "\n\n    color: ", ";\n    font-size: 12px;\n    letter-spacing: 1px;\n    margin-bottom: 16px;\n    text-transform: uppercase;\n"])), typography(function (t) { return t.label; }), color(function (c) { return c.navy; }));
export var SmallcapsTitle = function (_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b, text = _a.text;
    return React.createElement(SmallcapsTitleStyle, { className: "filter-title " + className }, text);
};
var templateObject_1;
//# sourceMappingURL=SmallcapsTitle.js.map