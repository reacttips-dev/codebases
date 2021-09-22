var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
import React, { useContext, useEffect, useState } from 'react';
import { difference, intersection, keys } from 'lodash';
import useForm from 'react-hook-form';
import { number, object, string } from 'yup';
import { Checkbox } from '../../forms';
import { InputError, InputField } from '../../Input';
import { useAntiBotTokens, useCookies, useEventListener, useNavigation, useRecaptcha, useRequest, } from '../../shared/hooks';
import { AppleButton, Button, FaceBookButton, GoogleButton } from '../buttons';
import { AuthModalContext } from '../providers';
import { LoginFormStyle } from './login-form-style';
import { useAppleLogin } from './use-apple-login';
import { useFacebookLogin } from './use-facebook-login';
import { useGoogleLogin } from './use-google-login';
var schema = object().shape({
    email: string().trim().email('Email Address is not a valid email address.').required('Email is required'),
    password: string().trim().required('Password is required'),
    team: number(),
    teamName: string().when('team', {
        is: function (val) { return val === 1; },
        then: string().required('Company is required'),
    }),
});
export var LoginForm = function (_a) {
    var _b = _a.isModal, isModal = _b === void 0 ? true : _b, redirectTo = _a.redirectTo, _c = _a.showSocialLogins, showSocialLogins = _c === void 0 ? true : _c, team = _a.team;
    var _d = useRecaptcha(), isRecaptchaLoading = _d.isRecaptchaLoading, recaptchaRef = _d.recaptchaRef, executeRecaptcha = _d.executeRecaptcha, recaptchaResponse = _d.recaptchaResponse, recaptchaError = _d.recaptchaError;
    var execute = useRequest({ isAjaxRequest: true }).execute;
    var path = useNavigation().path;
    var appleLogin = useAppleLogin().appleLogin;
    var _e = useFacebookLogin(redirectTo), facebookLogin = _e.facebookLogin, isFacebookLoading = _e.isFacebookLoading;
    var _f = useGoogleLogin(redirectTo), googleLogin = _f.googleLogin, isGoogleLoading = _f.isGoogleLoading;
    var authContext = useContext(AuthModalContext);
    var _g = __read(useState(''), 2), generalError = _g[0], setGeneralError = _g[1];
    var _h = __read(useState(0), 2), loginAttempts = _h[0], setLoginAttempts = _h[1];
    var _j = __read(useState(false), 2), isSubmitting = _j[0], setIsSubmitting = _j[1];
    var tokens = useAntiBotTokens().tokens;
    var cookies = useCookies().cookies;
    var csrfToken = cookies && cookies.YII_CSRF_TOKEN ? cookies.YII_CSRF_TOKEN : '';
    var enterKeyHandler = function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var validationResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(event.keyCode === 13)) return [3, 2];
                    event.preventDefault();
                    return [4, triggerValidation([{ name: 'email' }, { name: 'password' }])];
                case 1:
                    validationResult = _a.sent();
                    if (validationResult) {
                        onSubmit();
                    }
                    return [2];
                case 2: return [2];
            }
        });
    }); };
    useEventListener({ eventName: 'keydown', handler: enterKeyHandler });
    var _k = useForm({
        mode: 'onSubmit',
        validationSchema: schema,
    }), register = _k.register, handleSubmit = _k.handleSubmit, errors = _k.errors, setError = _k.setError, clearError = _k.clearError, getValues = _k.getValues, triggerValidation = _k.triggerValidation, setValue = _k.setValue;
    if (team && team.invitation) {
        setValue('email', team.invitation.email);
    }
    useEffect(function () {
        if (recaptchaResponse && recaptchaResponse !== '') {
            submitForm();
        }
    }, [recaptchaResponse]);
    var onSubmit = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (loginAttempts > 0 && !isRecaptchaLoading && recaptchaRef.current) {
                executeRecaptcha();
            }
            else {
                submitForm();
            }
            return [2];
        });
    }); };
    var submitForm = function () { return __awaiter(void 0, void 0, void 0, function () {
        var data, postData, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsSubmitting(true);
                    data = getValues();
                    postData = getPostData(data);
                    clearError();
                    setGeneralError('');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    setLoginAttempts(function (prev) { return prev + 1; });
                    return [4, execute({ url: '/ajaxlogin', data: postData, method: 'POST' })];
                case 2:
                    response = _a.sent();
                    window.location = response.data.redirectTo;
                    return [3, 4];
                case 3:
                    error_1 = _a.sent();
                    handleErrorResponse(error_1);
                    setIsSubmitting(false);
                    return [2];
                case 4: return [2];
            }
        });
    }); };
    var getPostData = function (data) {
        var postData = new URLSearchParams();
        postData.append('LoginForm[email]', data.email);
        postData.append('LoginForm[password]', data.password);
        postData.append('LoginForm[timestamp]', tokens.timestamp);
        postData.append('LoginForm[deviceVerificationToken]', tokens.deviceVerificationToken);
        postData.append('YII_CSRF_TOKEN', csrfToken);
        postData.append('recaptcha', recaptchaResponse ? recaptchaResponse : '');
        if (path && path !== '') {
            postData.append('LoginForm[redirectTo]', path);
        }
        if (team && team.isLogin) {
            postData.append('LoginForm[teamName]', data.teamName);
        }
        if (team && team.invitation) {
            postData.append('LoginForm[teamInviteId]', team.invitation.id.toString());
        }
        if (redirectTo) {
            postData.set('LoginForm[redirectTo]', redirectTo);
        }
        return postData;
    };
    var handleErrorResponse = function (error) {
        if (error.response.status > 400) {
            setGeneralError('Something went wrong. Please try again later');
            return;
        }
        var errors = error.response.data.errors;
        if (typeof errors === 'string') {
            setGeneralError(errors);
            return;
        }
        var inputErrorFields = intersection(schema._nodes, keys(errors));
        inputErrorFields.forEach(function (field) {
            setError(field, '', errors[field][0]);
        });
        var generalErrorFields = difference(keys(errors), inputErrorFields);
        generalErrorFields.forEach(function (field) {
            setGeneralError(errors[field]);
        });
    };
    var handleSignUp = function (event) {
        event.preventDefault();
        authContext.api.updateIsLogin(false);
    };
    var handleFacebookLogin = function (event) {
        event.preventDefault();
        facebookLogin();
    };
    var handleGoogleLogin = function (event) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.preventDefault();
                    return [4, googleLogin()];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    }); };
    var handleAppleLogin = function (event) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.preventDefault();
                    return [4, appleLogin()];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    }); };
    return (React.createElement(LoginFormStyle, null,
        React.createElement("form", { className: "login-form", method: "POST" },
            showSocialLogins && (React.createElement(React.Fragment, null,
                React.createElement(FaceBookButton, { isFacebookLoading: isFacebookLoading, text: 'Continue with Facebook', onClick: handleFacebookLogin }),
                React.createElement(GoogleButton, { isGoogleLoading: isGoogleLoading, text: 'Continue with Google', onClick: handleGoogleLogin }),
                React.createElement(AppleButton, { text: 'Continue with Apple', onClick: handleAppleLogin }),
                React.createElement("div", { className: "form-separator" },
                    React.createElement("p", null, "or")))),
            React.createElement(InputError, { error: (errors.email && errors.email.message) ||
                    (generalError && generalError) ||
                    (recaptchaError && recaptchaError) }),
            React.createElement(InputField, { placeholder: 'Email address', "aria-label": 'Email address', type: 'email', name: 'email', className: "login-inputs-fields" + (team && team.invitation ? ' bold' : ''), ref: register, readOnly: team && team.invitation ? true : false }),
            React.createElement(InputError, { error: errors.password && errors.password.message }),
            React.createElement(InputField, { placeholder: 'Password', "aria-label": 'Password', type: 'password', name: 'password', ref: register, className: team ? 'login-inputs-fields' : '' }),
            team && team.isLogin && (React.createElement(React.Fragment, null,
                React.createElement(InputError, { error: errors.teamName && errors.teamName.message }),
                React.createElement(InputField, { placeholder: 'Company', "aria-label": 'Company', type: 'text', name: 'teamName', ref: register, className: 'login-inputs-fields company' }),
                React.createElement(InputField, { type: 'hidden', name: 'team', value: 1, ref: register }))),
            !team && (React.createElement("div", { className: "remember-me" },
                React.createElement(Checkbox, { name: 'rememberMe', label: 'Keep me signed in until I sign out', ref: register }))),
            React.createElement(Button, { text: team ? team.submitText : 'Sign In', className: "full-width submit-btn" + (team ? ' team' : ''), onClick: handleSubmit(onSubmit), loading: isSubmitting }),
            !team && (React.createElement("div", { className: "forgot-password" },
                React.createElement("a", { className: "forgot-pass-text", target: "_blank", href: "/reset-password" }, "Forgot password?")))),
        isModal && (React.createElement("div", { className: "sign-up" },
            "Not a member yet?",
            ' ',
            React.createElement("button", { className: "link", onClick: handleSignUp }, "Sign Up."))),
        React.createElement("div", { ref: recaptchaRef, className: "grecaptcha" })));
};
//# sourceMappingURL=login-form.js.map