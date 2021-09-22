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
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Manager, Popper, Reference } from 'react-popper';
import styled from 'styled-components';
import { CloseIcon } from '../../Icons';
import { color } from '../../themes/utils';
var DefaultMargin = '16px';
export var PopoverStyle = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    background: ", ";\n    border: 1px solid ", ";\n    border-radius: 8px;\n    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);\n    z-index: 1301; /** Must override any MUI overlay/backdrop of z-index 1300 */\n    &.dark {\n        background: ", ";\n        border: 1px solid ", ";\n    }\n    &[data-placement='bottom'],\n    &[data-placement='bottom-start'],\n    &[data-placement='bottom-end'] {\n        margin-top: ", ";\n    }\n    &[data-placement='left'],\n    &[data-placement='left-start'],\n    &[data-placement='left-end'] {\n        margin-right: ", ";\n    }\n    &[data-placement='top'],\n    &[data-placement='top-start'],\n    &[data-placement='top-end'] {\n        margin-bottom: ", ";\n    }\n    &[data-placement='right'],\n    &[data-placement='right-start'],\n    &[data-placement='right-end'] {\n        margin-left: ", ";\n    }\n    .close {\n        position: absolute;\n        top: 20px;\n        right: 20px;\n        width: 24px;\n        height: 24px;\n        cursor: pointer;\n    }\n"], ["\n    background: ", ";\n    border: 1px solid ", ";\n    border-radius: 8px;\n    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);\n    z-index: 1301; /** Must override any MUI overlay/backdrop of z-index 1300 */\n    &.dark {\n        background: ", ";\n        border: 1px solid ", ";\n    }\n    &[data-placement='bottom'],\n    &[data-placement='bottom-start'],\n    &[data-placement='bottom-end'] {\n        margin-top: ", ";\n    }\n    &[data-placement='left'],\n    &[data-placement='left-start'],\n    &[data-placement='left-end'] {\n        margin-right: ", ";\n    }\n    &[data-placement='top'],\n    &[data-placement='top-start'],\n    &[data-placement='top-end'] {\n        margin-bottom: ", ";\n    }\n    &[data-placement='right'],\n    &[data-placement='right-start'],\n    &[data-placement='right-end'] {\n        margin-left: ", ";\n    }\n    .close {\n        position: absolute;\n        top: 20px;\n        right: 20px;\n        width: 24px;\n        height: 24px;\n        cursor: pointer;\n    }\n"])), color(function (c) { return c.white; }), color(function (c) { return c.silver; }), color(function (c) { return c.navy; }), color(function (c) { return c.navy; }), DefaultMargin, DefaultMargin, DefaultMargin, DefaultMargin);
export var Popover = function (_a) {
    var _b = _a.position, position = _b === void 0 ? 'top' : _b, _c = _a.targetContent, targetContent = _c === void 0 ? React.createElement("span", null) : _c, _d = _a.popoverContent, popoverContent = _d === void 0 ? React.createElement("span", null) : _d, _e = _a.isOpen, isOpen = _e === void 0 ? false : _e, _f = _a.isCloseIconVisible, isCloseIconVisible = _f === void 0 ? false : _f, _g = _a.click, click = _g === void 0 ? false : _g, _h = _a.disabled, disabled = _h === void 0 ? false : _h, _j = _a.renderPopoverContent, renderPopoverContent = _j === void 0 ? true : _j, _k = _a.portalContainer, portalContainer = _k === void 0 ? undefined : _k, _l = _a.closeOnClick, closeOnClick = _l === void 0 ? false : _l, _m = _a.closeOnDocumentClick, closeOnDocumentClick = _m === void 0 ? true : _m, _o = _a.timeoutProp, timeoutProp = _o === void 0 ? null : _o, _p = _a.top, top = _p === void 0 ? '0px' : _p, _q = _a.left, left = _q === void 0 ? '0px' : _q, _r = _a.width, width = _r === void 0 ? 'auto' : _r, _s = _a.setHoverModeTimeout, setHoverModeTimeout = _s === void 0 ? true : _s, _t = _a.onCloseHandler, onCloseHandler = _t === void 0 ? function () { } : _t, _u = _a.dark, dark = _u === void 0 ? false : _u, _v = _a.onClick, onClick = _v === void 0 ? function () { } : _v, _w = _a.isNoPlanSelectorExpEnabled, isNoPlanSelectorExpEnabled = _w === void 0 ? false : _w;
    var _x = __read(useState(isOpen), 2), popperState = _x[0], setPopperState = _x[1];
    var popperVisibility = popperState ? 'block' : 'none';
    var popperHoverTimeout;
    var popperReferenceNode;
    var refNode;
    var hoverMode = !isOpen && !click && !disabled;
    var closeTimeout = function () {
        var timer = setTimeout(function () {
            return setPopperState(false);
        }, timeoutProp);
        return function () { return clearTimeout(timer); };
    };
    if (timeoutProp) {
        closeTimeout();
    }
    var jiggle = function () {
        var doc = document.documentElement;
        var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
        window.scrollTo(0, top + 1);
        window.scrollTo(0, top);
    };
    var onDocumentClick = function (e) {
        if (isNoPlanSelectorExpEnabled && refNode.contains(e.target)) {
            return;
        }
        if (!popperReferenceNode.contains(e.target) && closeOnDocumentClick) {
            setPopperState(false);
            onCloseHandler();
        }
    };
    var onCloseIconClick = function () {
        setPopperState(false);
        onCloseHandler();
    };
    var onReferenceClick = function () {
        if (click && !disabled) {
            setPopperState(!popperState);
            if (!popperState) {
                onCloseHandler();
            }
            setTimeout(jiggle, 0);
        }
        onClick();
    };
    var onPopperMouseOver = function () {
        clearTimeout(popperHoverTimeout);
    };
    var onReferenceMouseOver = function () {
        if (hoverMode) {
            clearTimeout(popperHoverTimeout);
            setPopperState(true);
        }
    };
    var popperHide = function () {
        setPopperState(false);
        onCloseHandler();
    };
    var timeoutPopperHide = function () {
        if (!hoverMode) {
            return;
        }
        if (setHoverModeTimeout) {
            popperHoverTimeout = setTimeout(function () {
                popperHide();
            }, 200);
        }
        else {
            popperHide();
        }
    };
    var onPopoverClick = function () {
        if (closeOnClick) {
            setPopperState(false);
            onCloseHandler();
        }
    };
    var getAdditionalClasses = function () {
        return dark ? 'dark' : '';
    };
    var popperComponent = function () {
        return (React.createElement(Popper, { innerRef: function (node) { return (popperReferenceNode = node); }, modifiers: { preventOverflow: { boundariesElement: 'viewport' } }, placement: position }, function (_a) {
            var ref = _a.ref, style = _a.style, placement = _a.placement;
            return (React.createElement(PopoverStyle, { className: "pop " + getAdditionalClasses(), "data-placement": placement, onClick: onPopoverClick, onMouseLeave: timeoutPopperHide, onMouseOver: onPopperMouseOver, ref: ref, style: __assign(__assign({}, style), { opacity: 1, display: popperVisibility, top: top, left: left, width: width }) },
                isCloseIconVisible && (React.createElement(CloseIcon, { className: "close", onClick: onCloseIconClick, htmlColor: "#ffffff" })),
                renderPopoverContent && popoverContent));
        }));
    };
    useEffect(function () {
        document.addEventListener('mousedown', onDocumentClick);
        return function () {
            document.removeEventListener('mousedown', onDocumentClick);
        };
    }, []);
    return (React.createElement(Manager, null,
        React.createElement(Reference, { innerRef: function (node) { return (refNode = node); } }, function (_a) {
            var ref = _a.ref;
            return (React.createElement("span", { className: "ref", onClick: onReferenceClick, onMouseOut: timeoutPopperHide, onMouseOver: onReferenceMouseOver, ref: ref }, targetContent));
        }),
        portalContainer ? createPortal(popperComponent(), portalContainer) : popperComponent()));
};
var templateObject_1;
//# sourceMappingURL=popover.js.map