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
import { darken } from 'polished';
import styled, { css } from 'styled-components';
import { Loading } from '../../Loading';
import { colors } from '../../themes/default';
import { color, minWidthForScreen, typography } from '../../themes/utils';
var BackgroundShadeAmount = 0.05;
export var TargetType;
(function (TargetType) {
    TargetType["self"] = "_self";
    TargetType["blank"] = "_blank";
    TargetType["parent"] = "_parent";
    TargetType["top"] = "_top";
})(TargetType || (TargetType = {}));
export var buttonStyleDefaults = {
    primaryColor: color(function (c) { return c.wanderGreen; }),
    hoverFillColor: color(function (c) { return darken(BackgroundShadeAmount, c.wanderGreen); }),
    textColor: color(function (c) { return c.navy; }),
};
export var buttonColors = {
    navy: {
        primaryColor: color(function (c) { return c.navy; }),
        textColor: color(function (c) { return c.white; }),
        hoverFillColor: color(function (c) { return darken(BackgroundShadeAmount, c.navy); }),
    },
    charcoal: {
        primaryColor: color(function (c) { return c.charcoal; }),
        hoverFillColor: color(function (c) { return darken(BackgroundShadeAmount, c.charcoal); }),
    },
    white: {
        primaryColor: color(function (c) { return c.white; }),
        hoverFillColor: color(function (c) { return darken(BackgroundShadeAmount, c.white); }),
        textColor: color(function (c) { return c.navy; }),
    },
    yellow: {
        primaryColor: color(function (c) { return c.yellow; }),
        hoverFillColor: color(function (c) { return darken(BackgroundShadeAmount, c.yellow); }),
        textColor: color(function (c) { return c.navy; }),
    },
    wanderGreen: {
        primaryColor: color(function (c) { return c.wanderGreen; }),
        hoverFillColor: color(function (c) { return darken(BackgroundShadeAmount, c.wanderGreen); }),
        textColor: color(function (c) { return c.navy; }),
    },
    red: {
        primaryColor: color(function (c) { return c.red; }),
        hoverFillColor: color(function (c) { return darken(BackgroundShadeAmount, c.red); }),
    },
    tag: {
        primaryColor: color(function (c) { return c.concrete; }),
        hoverFillColor: color(function (c) { return darken(BackgroundShadeAmount, c.concrete); }),
        textColor: color(function (c) { return c.charcoal; }),
    },
    violet: {
        primaryColor: color(function (c) { return c.violet; }),
        textColor: color(function (c) { return c.white; }),
        hoverFillColor: color(function (c) { return darken(BackgroundShadeAmount, c.violet); }),
    },
    canvas: {
        primaryColor: color(function (c) { return c.canvas; }),
        textColor: color(function (c) { return c.navy; }),
        hoverFillColor: color(function (c) { return darken(BackgroundShadeAmount, c.canvas); }),
    },
    blue: {
        primaryColor: color(function (c) { return c.blue; }),
        textColor: color(function (c) { return c.navy; }),
        hoverFillColor: color(function (c) { return darken(BackgroundShadeAmount, c.blue); }),
    },
};
export var buttonStyle = function (options) {
    var _a = __assign(__assign({}, buttonStyleDefaults), options), primaryColor = _a.primaryColor, hoverFillColor = _a.hoverFillColor, textColor = _a.textColor;
    return css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n        ", ";\n\n        border-radius: 4px;\n        box-sizing: border-box;\n        cursor: pointer;\n        display: inline-block;\n        font-weight: bold;\n        padding: 0 20px;\n        position: relative;\n        text-decoration: none;\n        text-align: center;\n        vertical-align: middle;\n        white-space: nowrap;\n        transition: all 200ms ease-in-out;\n\n        &.icon {\n            display: flex;\n            align-items: center;\n            justify-content: center;\n\n            svg {\n                display: flex;\n                margin-right: 4px;\n            }\n        }\n    "], ["\n        ", ";\n\n        border-radius: 4px;\n        box-sizing: border-box;\n        cursor: pointer;\n        display: inline-block;\n        font-weight: bold;\n        padding: 0 20px;\n        position: relative;\n        text-decoration: none;\n        text-align: center;\n        vertical-align: middle;\n        white-space: nowrap;\n        transition: all 200ms ease-in-out;\n\n        &.icon {\n            display: flex;\n            align-items: center;\n            justify-content: center;\n\n            svg {\n                display: flex;\n                margin-right: 4px;\n            }\n        }\n    "])), buttonStateColorStyles({ primaryColor: primaryColor, hoverFillColor: hoverFillColor, textColor: textColor }));
};
export var buttonStateColorStyles = function (options) {
    var _a = __assign(__assign({}, buttonStyleDefaults), options), primaryColor = _a.primaryColor, hoverFillColor = _a.hoverFillColor, textColor = _a.textColor;
    return css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n        background-color: ", ";\n        border: 1px solid ", ";\n        color: ", ";\n\n        svg,\n        path {\n            fill: ", ";\n            stroke: ", ";\n        }\n\n        &:active {\n            color: ", ";\n        }\n\n        &:visited {\n            color: ", ";\n            background-color: ", ";\n            border-color: ", ";\n        }\n\n        &:hover {\n            color: ", ";\n            background-color: ", ";\n            border-color: ", ";\n        }\n    "], ["\n        background-color: ", ";\n        border: 1px solid ", ";\n        color: ", ";\n\n        svg,\n        path {\n            fill: ", ";\n            stroke: ", ";\n        }\n\n        &:active {\n            color: ", ";\n        }\n\n        &:visited {\n            color: ", ";\n            background-color: ", ";\n            border-color: ", ";\n        }\n\n        &:hover {\n            color: ", ";\n            background-color: ", ";\n            border-color: ", ";\n        }\n    "])), primaryColor, primaryColor, textColor, textColor, textColor, textColor, textColor, primaryColor, primaryColor, textColor, hoverFillColor, hoverFillColor);
};
export var disabledButtonStyle = function (options) {
    var border = color(function (c) { return c.concrete; });
    var background = color(function (c) { return c.concrete; });
    var text = color(function (c) { return c.charcoal; });
    if (options && options.isGhost) {
        background = color(function (c) { return c.transparent; });
        text = color(function (c) { return c.concrete; });
    }
    return css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n        &:disabled,\n        &.disabled {\n            background-color: ", " !important;\n            border-color: ", " !important;\n            color: ", " !important;\n            cursor: default !important;\n\n            &:active {\n                top: 0;\n            }\n        }\n    "], ["\n        &:disabled,\n        &.disabled {\n            background-color: ", " !important;\n            border-color: ", " !important;\n            color: ", " !important;\n            cursor: default !important;\n\n            &:active {\n                top: 0;\n            }\n        }\n    "])), background, border, text);
};
var ghostButtonStyle = function (options) {
    var _a = __assign(__assign({}, buttonStyleDefaults), options), primaryColor = _a.primaryColor, hoverFillColor = _a.hoverFillColor, textColor = _a.textColor;
    return css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n        background-color: transparent;\n        border: 1px solid ", ";\n        color: ", ";\n        text-decoration: none;\n\n        svg,\n        path {\n            fill: ", ";\n            stroke: ", ";\n        }\n\n        &:active {\n            color: ", ";\n        }\n\n        &:visited {\n            color: ", ";\n            background-color: transparent;\n            border-color: ", ";\n        }\n\n        &:hover {\n            color: ", ";\n            background-color: ", ";\n            border-color: ", ";\n\n            svg,\n            path {\n                fill: ", ";\n                stroke: ", ";\n            }\n        }\n    "], ["\n        background-color: transparent;\n        border: 1px solid ", ";\n        color: ", ";\n        text-decoration: none;\n\n        svg,\n        path {\n            fill: ", ";\n            stroke: ", ";\n        }\n\n        &:active {\n            color: ", ";\n        }\n\n        &:visited {\n            color: ", ";\n            background-color: transparent;\n            border-color: ", ";\n        }\n\n        &:hover {\n            color: ", ";\n            background-color: ", ";\n            border-color: ", ";\n\n            svg,\n            path {\n                fill: ", ";\n                stroke: ", ";\n            }\n        }\n    "])), primaryColor, primaryColor, primaryColor, primaryColor, textColor, primaryColor, primaryColor, textColor, hoverFillColor, hoverFillColor, textColor, textColor);
};
var buttonSelectors = css(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n    &.full-width {\n        width: 100%;\n    }\n\n    &.small {\n        font-size: 13px;\n        height: 28px;\n        line-height: 26px;\n        min-width: auto;\n        padding: 0 20px;\n    }\n\n    &.tertiary {\n        background-color: ", ";\n        color: white;\n        border: 1px solid ", ";\n    }\n\n    @media screen and (min-width: ", ") {\n        &:active {\n            top: 1px;\n        }\n    }\n\n    &.medium {\n        height: 32px;\n        line-height: 31px;\n        min-width: 80px;\n        font-size: 15px;\n    }\n\n    &.large {\n        font-size: 18px;\n        height: 40px;\n        line-height: 39px;\n        min-width: 96px;\n    }\n\n    &.alt {\n        ", "\n    }\n\n    &.alt-navy-ghost {\n        ", ";\n        ", ";\n    }\n\n    &.alt-navy {\n        ", ";\n    }\n\n    &.alt-white {\n        ", ";\n    }\n\n    &.alt-white-ghost {\n        ", ";\n        ", ";\n    }\n\n    &.alt-yellow {\n        ", ";\n    }\n\n    &.alt-yellow-ghost {\n        ", ";\n        ", ";\n    }\n\n    &.alt-wanderGreen {\n        ", ";\n    }\n\n    &.alt-wanderGreen-ghost {\n        ", ";\n        ", ";\n    }\n\n    &.alt-violet {\n        ", ";\n    }\n\n    &.alt-violet-ghost {\n        ", ";\n        ", ";\n    }\n\n    &.alt-red {\n        ", ";\n    }\n\n    &.alt-red-ghost {\n        ", ";\n    }\n\n    &.alt-tag {\n        ", ";\n\n        border-radius: 16px;\n    }\n\n    &.alt-canvas {\n        ", ";\n    }\n\n    &.alt-blue {\n        ", ";\n    }\n"], ["\n    &.full-width {\n        width: 100%;\n    }\n\n    &.small {\n        font-size: 13px;\n        height: 28px;\n        line-height: 26px;\n        min-width: auto;\n        padding: 0 20px;\n    }\n\n    &.tertiary {\n        background-color: ", ";\n        color: white;\n        border: 1px solid ", ";\n    }\n\n    @media screen and (min-width: ", ") {\n        &:active {\n            top: 1px;\n        }\n    }\n\n    &.medium {\n        height: 32px;\n        line-height: 31px;\n        min-width: 80px;\n        font-size: 15px;\n    }\n\n    &.large {\n        font-size: 18px;\n        height: 40px;\n        line-height: 39px;\n        min-width: 96px;\n    }\n\n    &.alt {\n        ", "\n    }\n\n    &.alt-navy-ghost {\n        ", ";\n        ", ";\n    }\n\n    &.alt-navy {\n        ", ";\n    }\n\n    &.alt-white {\n        ", ";\n    }\n\n    &.alt-white-ghost {\n        ", ";\n        ", ";\n    }\n\n    &.alt-yellow {\n        ", ";\n    }\n\n    &.alt-yellow-ghost {\n        ", ";\n        ", ";\n    }\n\n    &.alt-wanderGreen {\n        ", ";\n    }\n\n    &.alt-wanderGreen-ghost {\n        ", ";\n        ", ";\n    }\n\n    &.alt-violet {\n        ", ";\n    }\n\n    &.alt-violet-ghost {\n        ", ";\n        ", ";\n    }\n\n    &.alt-red {\n        ", ";\n    }\n\n    &.alt-red-ghost {\n        ", ";\n    }\n\n    &.alt-tag {\n        ", ";\n\n        border-radius: 16px;\n    }\n\n    &.alt-canvas {\n        ", ";\n    }\n\n    &.alt-blue {\n        ", ";\n    }\n"])), color(function (c) { return c.violet; }), color(function (c) { return c.violet; }), minWidthForScreen('medium'), ghostButtonStyle(buttonStyleDefaults), ghostButtonStyle(buttonColors.navy), disabledButtonStyle({ isGhost: true }), buttonStyle(buttonColors.navy), buttonStyle(buttonColors.white), ghostButtonStyle(buttonColors.white), disabledButtonStyle({ isGhost: true }), buttonStyle(buttonColors.yellow), ghostButtonStyle(buttonColors.yellow), disabledButtonStyle({ isGhost: true }), buttonStyle(buttonColors.wanderGreen), ghostButtonStyle(buttonColors.wanderGreen), disabledButtonStyle({ isGhost: true }), buttonStyle(buttonColors.violet), ghostButtonStyle(buttonColors.violet), disabledButtonStyle({ isGhost: true }), buttonStyle(buttonColors.red), ghostButtonStyle(buttonColors.red), buttonStyle(buttonColors.tag), buttonStyle(buttonColors.canvas), buttonStyle(buttonColors.blue));
var ButtonStyle = styled.button(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n    ", "\n    ", ";\n    ", ";\n\n    display: inline-flex;\n    justify-content: center;\n    align-items: center;\n\n    &[type='button'],\n    &[type='reset'],\n    &[type='submit'] {\n        -webkit-appearance: button;\n    }\n\n    ", ";\n"], ["\n    ", "\n    ", ";\n    ", ";\n\n    display: inline-flex;\n    justify-content: center;\n    align-items: center;\n\n    &[type='button'],\n    &[type='reset'],\n    &[type='submit'] {\n        -webkit-appearance: button;\n    }\n\n    ", ";\n"])), typography(function (t) { return t.links.nav.small; }), buttonStyle(), disabledButtonStyle(), buttonSelectors);
var AnchorStyle = styled.a(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n    ", "\n    ", ";\n    ", ";\n\n    display: flex;\n    align-items: center;\n    text-decoration: none;\n    color: initial;\n    width: fit-content;\n\n    .icon {\n        display: flex;\n        align-items: center;\n        margin-right: 4px;\n    }\n\n    ", ";\n"], ["\n    ", "\n    ", ";\n    ", ";\n\n    display: flex;\n    align-items: center;\n    text-decoration: none;\n    color: initial;\n    width: fit-content;\n\n    .icon {\n        display: flex;\n        align-items: center;\n        margin-right: 4px;\n    }\n\n    ", ";\n"])), typography(function (t) { return t.links.nav.small; }), buttonStyle(), disabledButtonStyle(), buttonSelectors);
export var ButtonType;
(function (ButtonType) {
    ButtonType["Alt"] = "alt";
    ButtonType["AltNavy"] = "alt-navy";
    ButtonType["AltNavyGhost"] = "alt-navy-ghost";
    ButtonType["AltRed"] = "alt-red";
    ButtonType["AltRedGhost"] = "alt-red";
    ButtonType["AltViolet"] = "alt-violet";
    ButtonType["AltVioletGhost"] = "alt-violet-ghost";
    ButtonType["AltWanderGreen"] = "alt-wanderGreen";
    ButtonType["AltWanderGreenGhost"] = "alt-wanderGreen-ghost";
    ButtonType["AltWhite"] = "alt-white";
    ButtonType["AltWhiteGhost"] = "alt-white-ghost";
    ButtonType["AltYellow"] = "alt-yellow";
    ButtonType["AltYellowGhost"] = "alt-yellow-ghost";
    ButtonType["AltBlue"] = "alt-blue";
})(ButtonType || (ButtonType = {}));
export var ButtonSize;
(function (ButtonSize) {
    ButtonSize["Small"] = "small";
    ButtonSize["Medium"] = "medium";
    ButtonSize["Large"] = "large";
})(ButtonSize || (ButtonSize = {}));
export var Button = function (props) {
    var className = [
        props.type || '',
        props.size || 'large',
        props.fullWidth && 'full-width',
        props.icon && 'icon',
        props.className,
    ].join(' ');
    if (props.disabled) {
        className = className + " disabled";
    }
    if (props.href) {
        var optionalAnchorProps = {};
        if (props.target) {
            optionalAnchorProps.target = props.target;
            optionalAnchorProps.rel = props.rel || 'noopener noreferrer';
        }
        if (props['data-testid']) {
            optionalAnchorProps['data-testid'] = props['data-testid'];
        }
        return (React.createElement(AnchorStyle, __assign({ href: props.href, className: className, onClick: props.onClick }, optionalAnchorProps),
            props.icon,
            React.createElement("span", null, props.text)));
    }
    return (React.createElement(ButtonStyle, __assign({ type: "button", disabled: props.loading || props.disabled, onClick: props.onClick, className: "button " + className, role: "button" }, (props['data-testid'] ? { 'data-testid': props['data-testid'] } : {})),
        props.icon,
        props.loading ? React.createElement(Loading, { size: 24, fillColor: colors.white }) : React.createElement("span", null, props.text)));
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
//# sourceMappingURL=button.js.map