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
import React, { useCallback, useMemo, useState } from 'react';
import { CloseIcon } from '../../Icons';
import { AuthModalProvider } from '../providers';
import { AuthModal, LoginModal, ModalTrigger, SignUpModal } from '.';
export var ButtonType;
(function (ButtonType) {
    ButtonType[ButtonType["Button"] = 0] = "Button";
    ButtonType[ButtonType["Link"] = 1] = "Link";
})(ButtonType || (ButtonType = {}));
export var AuthType;
(function (AuthType) {
    AuthType[AuthType["Login"] = 0] = "Login";
    AuthType[AuthType["SignUp"] = 1] = "SignUp";
})(AuthType || (AuthType = {}));
export var ModalController = function (_a) {
    var authType = _a.authType, _b = _a.requiresTrigger, requiresTrigger = _b === void 0 ? false : _b, loginData = _a.loginData, signUpData = _a.signUpData, _c = _a.openOnLoad, openOnLoad = _c === void 0 ? false : _c, _d = _a.showEmailSignUp, showEmailSignUp = _d === void 0 ? false : _d, triggerProps = _a.triggerProps, redirectTo = _a.redirectTo, _e = _a.onCtaClick, onCtaClick = _e === void 0 ? function () { } : _e;
    var _f = __read(useState(openOnLoad), 2), isModalOpen = _f[0], setModalOpen = _f[1];
    var _g = __read(useState(authType === AuthType.Login), 2), isLogin = _g[0], setIsLogin = _g[1];
    var _h = __read(useState(showEmailSignUp), 2), isEmailSignUp = _h[0], setIsEmailSignUp = _h[1];
    var openModal = function () {
        onCtaClick();
        setModalOpen(true);
    };
    var closeModal = function () {
        setIsEmailSignUp(false);
        setIsLogin(authType === AuthType.Login);
        setModalOpen(false);
    };
    var closeAuthModal = useCallback(function () { return setModalOpen(false); }, []);
    var updateIsLogin = useCallback(function (newState) { return setIsLogin(newState); }, []);
    var updateIsEmailSignUp = useCallback(function (newState) { return setIsEmailSignUp(newState); }, []);
    var memoizedApi = useMemo(function () { return ({ closeAuthModal: closeAuthModal, updateIsLogin: updateIsLogin, updateIsEmailSignUp: updateIsEmailSignUp, isLogin: isLogin }); }, []);
    var Form = isLogin ? (React.createElement(LoginModal, { data: loginData, redirectTo: redirectTo && redirectTo.login })) : (React.createElement(SignUpModal, { isEmailSignUp: isEmailSignUp, data: signUpData, redirectTo: redirectTo && redirectTo.signup }));
    return (React.createElement("div", null,
        requiresTrigger && triggerProps && (React.createElement(ModalTrigger, { buttonText: triggerProps.buttonText, buttonType: triggerProps.buttonType, buttonClass: triggerProps.buttonClass, openModal: openModal })),
        React.createElement(AuthModalProvider, { api: memoizedApi },
            React.createElement(AuthModal, { isModalOpen: isModalOpen, closeModal: closeModal },
                React.createElement(CloseIcon, { "aria-label": "Close Modal", className: "close-icon", onClick: closeModal }),
                Form))));
};
//# sourceMappingURL=controller.js.map