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
var _a, _b;
var _this = this;
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { color, typography } from '../../themes/utils';
import { Button, ButtonSize } from '../buttons';
import { ReactModalAdapter } from './adapter';
import { PromoModalBackground } from './background';
export var MODAL_VERSIONS;
(function (MODAL_VERSIONS) {
    MODAL_VERSIONS["ACTION"] = "ACTION";
    MODAL_VERSIONS["PROMO"] = "PROMO";
})(MODAL_VERSIONS || (MODAL_VERSIONS = {}));
var CANCEL_BUTTON_CLASS = (_a = {},
    _a[MODAL_VERSIONS.ACTION] = 'alt-navy-ghost',
    _a[MODAL_VERSIONS.PROMO] = 'alt-white-ghost',
    _a);
var CTA_CONTAINER_COLOR = (_b = {},
    _b[MODAL_VERSIONS.ACTION] = 'canvas',
    _b[MODAL_VERSIONS.PROMO] = 'navy',
    _b);
var DialogModalStyles = styled(ReactModalAdapter)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    &__content {\n        background-color: ", ";\n        border-radius: 12px;\n        border: 1px solid ", ";\n        cursor: default;\n        display: flex;\n        flex-direction: column;\n        height: auto;\n        justify-content: space-between;\n        left: 50%;\n        margin-right: 120px;\n        min-height: 376px;\n        outline: none;\n        overflow: auto;\n        overflow: hidden;\n        padding: 0;\n        position: relative;\n        top: 50%;\n        transform: translate(-50%, -50%);\n        width: 560px;\n        z-index: 10; /* TODO z-index: Move to new z-index definition */\n    }\n\n    &__overlay {\n        width: 100vw;\n        height: 100vh;\n        top: 0;\n        left: 0;\n        position: fixed;\n        z-index: 11000; /* TODO z-index: Move to new z-index definition */\n        background-color: rgba(0, 0, 0, 0.8);\n        cursor: zoom-out;\n    }\n"], ["\n    &__content {\n        background-color: ", ";\n        border-radius: 12px;\n        border: 1px solid ", ";\n        cursor: default;\n        display: flex;\n        flex-direction: column;\n        height: auto;\n        justify-content: space-between;\n        left: 50%;\n        margin-right: 120px;\n        min-height: 376px;\n        outline: none;\n        overflow: auto;\n        overflow: hidden;\n        padding: 0;\n        position: relative;\n        top: 50%;\n        transform: translate(-50%, -50%);\n        width: 560px;\n        z-index: 10; /* TODO z-index: Move to new z-index definition */\n    }\n\n    &__overlay {\n        width: 100vw;\n        height: 100vh;\n        top: 0;\n        left: 0;\n        position: fixed;\n        z-index: 11000; /* TODO z-index: Move to new z-index definition */\n        background-color: rgba(0, 0, 0, 0.8);\n        cursor: zoom-out;\n    }\n"])), color(function (c) { return c.white; }), color(function (c) { return c.concrete; }));
var CtaContainer = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    background-color: ", ";\n    padding: 32px 0;\n    text-align: center;\n\n    .button {\n        margin: 0 8px;\n    }\n"], ["\n    background-color: ", ";\n    padding: 32px 0;\n    text-align: center;\n\n    .button {\n        margin: 0 8px;\n    }\n"])), function (props) { return color(function (c) { return c[props.color]; }); });
var ActionExplanation = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    ", ";\n\n    margin: auto;\n    padding: 89px 40px 71px;\n    text-align: center;\n\n    h2 {\n        ", "\n\n        margin-bottom: 16px;\n    }\n"], ["\n    ", ";\n\n    margin: auto;\n    padding: 89px 40px 71px;\n    text-align: center;\n\n    h2 {\n        ", "\n\n        margin-bottom: 16px;\n    }\n"])), typography(function (t) { return t.body1; }), typography(function (t) { return t.h2; }));
var PromoExplanation = styled(ActionExplanation)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    padding-top: 104px;\n    padding-bottom: 40px;\n\n    h2 {\n        margin-bottom: 24px;\n    }\n"], ["\n    padding-top: 104px;\n    padding-bottom: 40px;\n\n    h2 {\n        margin-bottom: 24px;\n    }\n"])));
var Background = styled(PromoModalBackground)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n    color: ", ";\n    position: absolute;\n    top: 0;\n    right: -90px;\n    z-index: -1;\n"], ["\n    color: ", ";\n    position: absolute;\n    top: 0;\n    right: -90px;\n    z-index: -1;\n"])), color(function (c) { return c.white; }));
export var DialogModal = function (_a) {
    var _b = _a.version, version = _b === void 0 ? MODAL_VERSIONS.ACTION : _b, _c = _a.cta, cta = _c === void 0 ? {
        text: 'Confirm',
        onClick: function () { },
    } : _c, _d = _a.cancelCta, cancelCta = _d === void 0 ? {
        text: 'Cancel',
        onClick: function () { },
    } : _d, _e = _a.showCancelButton, showCancelButton = _e === void 0 ? false : _e, _f = _a.children, children = _f === void 0 ? null : _f;
    var _g = __read(useState(true), 2), isModalOpen = _g[0], setModalOpen = _g[1];
    var _h = __read(useState(null), 2), willContinue = _h[0], setWillContinue = _h[1];
    var cancelButtonClass = CANCEL_BUTTON_CLASS[version];
    var ctaContainerColor = CTA_CONTAINER_COLOR[version];
    var Explanation = version === MODAL_VERSIONS.ACTION ? ActionExplanation : PromoExplanation;
    var continueAndClose = function (userContinued) {
        setModalOpen(false);
        setWillContinue(userContinued);
    };
    useEffect(function () {
        if (willContinue === null) {
            return;
        }
        if (!willContinue) {
            cancelCta.onClick();
            return;
        }
        cta.onClick();
    }, [willContinue]);
    return (React.createElement(DialogModalStyles, { ariaHideApp: false, isOpen: isModalOpen, shouldCloseOnEsc: true, shouldCloseOnOverlayClick: true, onRequestClose: continueAndClose.bind(_this, false) },
        React.createElement(Explanation, null,
            version === MODAL_VERSIONS.PROMO && React.createElement(Background, null),
            children),
        React.createElement(CtaContainer, { color: ctaContainerColor },
            showCancelButton && (React.createElement(Button, { className: cancelButtonClass, size: ButtonSize.Large, text: cancelCta.text || 'Cancel', onClick: continueAndClose.bind(_this, false) })),
            React.createElement(Button, { className: cta.class && cta.class, size: ButtonSize.Large, text: cta.text || 'Yes, Please', onClick: continueAndClose.bind(_this, true) }))));
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=dialog.js.map