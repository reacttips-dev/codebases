var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import React, { useState } from 'react';
import styled from 'styled-components';
import { color, typography } from '../../themes/utils';
import { buttonStateColorStyles } from './button';
var FollowButtonStyle = styled.button(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    ", ";\n    ", "\n\n    font-weight: bold;\n    cursor: pointer;\n    border-radius: 16px;\n    height: 32px;\n    min-width: 78px;\n    padding: 0 16px;\n    background-color: transparent;\n    color: ", ";\n\n    &:hover {\n        ", "\n    }\n"], ["\n    ", ";\n    ",
    "\n\n    font-weight: bold;\n    cursor: pointer;\n    border-radius: 16px;\n    height: 32px;\n    min-width: 78px;\n    padding: 0 16px;\n    background-color: transparent;\n    color: ", ";\n\n    &:hover {\n        ",
    "\n    }\n"])), typography(function (t) { return t.subtitle; }), buttonStateColorStyles({
    primaryColor: color(function (c) { return c.violet; }),
    textColor: color(function (c) { return c.violet; }),
    hoverFillColor: color(function (c) { return c.violet; }),
}), color(function (c) { return c.violet; }), buttonStateColorStyles({
    primaryColor: color(function (c) { return c.violet; }),
    textColor: color(function (c) { return c.white; }),
    hoverFillColor: color(function (c) { return c.violet; }),
}));
var FollowContainerStyle = styled.span(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    &.just-clicked button.selected,\n    .selected {\n        background-color: ", ";\n        color: ", ";\n    }\n\n    &.just-clicked button:not(.selected):hover,\n    .selected:hover {\n        background-color: transparent;\n        color: ", ";\n    }\n"], ["\n    &.just-clicked button.selected,\n    .selected {\n        background-color: ", ";\n        color: ", ";\n    }\n\n    &.just-clicked button:not(.selected):hover,\n    .selected:hover {\n        background-color: transparent;\n        color: ", ";\n    }\n"])), color(function (c) { return c.violet; }), color(function (c) { return c.white; }), color(function (c) { return c.violet; }));
var CtaToUnfollowFace = function () {
    var _a = __read(useState('Following'), 2), buttonText = _a[0], setButtonText = _a[1];
    var mouseEnter = function () { return setButtonText('Unfollow'); };
    var mouseLeave = function () { return setButtonText('Following'); };
    return (React.createElement(FollowButtonStyle, { onMouseEnter: mouseEnter, onMouseLeave: mouseLeave, className: "selected" }, buttonText));
};
var CtaToFollowFace = function () { return React.createElement(FollowButtonStyle, null, "Follow "); };
export var FollowButton = function (props) {
    var _a = __read(useState(false), 2), clicked = _a[0], setButtonClicked = _a[1];
    var mouseLeave = function () { return setButtonClicked(false); };
    var doClick = function () {
        setButtonClicked(true);
        props.onClick();
    };
    var buttonClass = clicked ? 'just-clicked' : '';
    var activeButtonFace = props.selected ? React.createElement(CtaToUnfollowFace, null) : React.createElement(CtaToFollowFace, null);
    return (React.createElement(FollowContainerStyle, { onMouseLeave: mouseLeave, onClick: doClick, className: buttonClass, role: "button" }, activeButtonFace));
};
var templateObject_1, templateObject_2;
//# sourceMappingURL=follow-button.js.map