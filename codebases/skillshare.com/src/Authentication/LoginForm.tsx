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
import React, { useEffect, useState } from 'react';
import { difference, intersection, keys } from 'lodash';
import useForm from 'react-hook-form';
import { Button, Divider, Grid, TextField } from '@material-ui/core';
import { Checkbox } from '../forms/Checkbox';
import { Loading } from '../Loading';
import { useEventListener, useNavigation } from '../shared/hooks';
import { enterKeyPress, getLoginPostData, LoginSchema, useLoginFormStyles, } from './LoginFormTypes';
import { SocialButtonContent } from './SocialButtonContent';
import { useTextFieldErrorStyles, useTextFieldStyles } from './TextFieldStyles';
import { useAuthFormState } from './useAuthFormState';
export function LoginForm(_a) {
    var _this = this;
    var redirectTo = _a.redirectTo, _b = _a.isModal, isModal = _b === void 0 ? true : _b, _c = _a.showSocialLogins, showSocialLogins = _c === void 0 ? true : _c, team = _a.team, switchToSignUp = _a.switchToSignUp;
    var classes = useLoginFormStyles();
    var textFieldClasses = useTextFieldStyles();
    var textFieldErrorClasses = useTextFieldErrorStyles();
    var loginFormState = useAuthFormState();
    var _d = __read(useState(''), 2), generalError = _d[0], setGeneralError = _d[1];
    var _e = __read(useState(false), 2), isSubmitting = _e[0], setIsSubmitting = _e[1];
    var path = useNavigation().path;
    var _f = __read(useState(0), 2), loginAttempts = _f[0], setLoginAttempts = _f[1];
    var _g = useForm({
        mode: 'onSubmit',
        validationSchema: LoginSchema,
    }), register = _g.register, handleSubmit = _g.handleSubmit, errors = _g.errors, setError = _g.setError, clearError = _g.clearError, getValues = _g.getValues, triggerValidation = _g.triggerValidation, setValue = _g.setValue;
    if (team && team.invitation) {
        setValue('email', team.invitation.email);
    }
    useEffect(function () {
        if (loginFormState.recaptcha.recaptchaResponse && loginFormState.recaptcha.recaptchaResponse !== '') {
            submitForm();
        }
    }, [loginFormState.recaptcha.recaptchaResponse]);
    var enterKeyHandler = function (event) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            enterKeyPress({ event: event, validate: triggerValidation, onSubmit: onSubmit });
            return [2];
        });
    }); };
    useEventListener({ eventName: 'keydown', handler: enterKeyHandler });
    var onSubmit = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (loginAttempts > 0 &&
                !loginFormState.recaptcha.isRecaptchaLoading &&
                loginFormState.recaptcha.recaptchaRef.current) {
                loginFormState.recaptcha.executeRecaptcha();
            }
            else {
                submitForm();
            }
            return [2];
        });
    }); };
    var submitForm = function () { return __awaiter(_this, void 0, void 0, function () {
        var data, postData, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsSubmitting(true);
                    data = getValues();
                    postData = getLoginPostData({
                        data: data,
                        csrfToken: loginFormState.csrfToken,
                        tokens: loginFormState.tokens,
                        path: path,
                        team: team,
                        redirectTo: redirectTo,
                        recaptchaResponse: loginFormState.recaptcha.recaptchaResponse,
                    });
                    clearError();
                    setGeneralError('');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    setLoginAttempts(function (prev) { return prev + 1; });
                    return [4, loginFormState.request.execute({
                            url: '/ajaxlogin',
                            data: postData,
                            method: 'POST',
                        })];
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
        var inputErrorFields = intersection(LoginSchema._nodes, keys(errors));
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
        switchToSignUp(false);
    };
    return (React.createElement("form", null,
        React.createElement(Grid, { container: true, className: classes.grid },
            showSocialLogins && (React.createElement(React.Fragment, null,
                React.createElement(SocialButtonContent, { isSignUp: false, redirectTo: redirectTo }),
                React.createElement(Grid, { item: true, xs: 12 },
                    React.createElement("div", { className: "form-separator " + classes.formSeparator },
                        React.createElement("p", null, "or"))))),
            (generalError && React.createElement("p", { className: textFieldErrorClasses.root }, generalError)) ||
                (loginFormState.recaptcha.recaptchaError && (React.createElement("p", { className: textFieldErrorClasses.root }, loginFormState.recaptcha.recaptchaError))),
            errors.email && React.createElement("p", { className: textFieldErrorClasses.root }, errors.email.message),
            React.createElement(Grid, { item: true, xs: 12 },
                React.createElement(TextField, { name: 'email', type: 'email', inputRef: register, inputProps: {
                        'aria-label': 'Email address',
                        className: team && team.invitation ? 'bold' : 'normal',
                        readOnly: team && team.invitation ? true : false,
                    }, placeholder: 'Email address', variant: "outlined", classes: textFieldClasses, className: 'bold' })),
            errors.password && React.createElement("p", { className: textFieldErrorClasses.root }, errors.password.message),
            React.createElement(Grid, { item: true, xs: 12 },
                React.createElement(TextField, { inputRef: register, name: 'password', type: 'password', inputProps: { 'aria-label': 'Password' }, placeholder: 'Password', variant: "outlined", classes: textFieldClasses })),
            team && team.isLogin && (React.createElement(React.Fragment, null,
                errors.teamName && React.createElement("p", { className: textFieldErrorClasses.root }, errors.teamName.message),
                React.createElement(Grid, { item: true, xs: 12 },
                    React.createElement(TextField, { name: 'teamName', inputRef: register, inputProps: { 'aria-label': 'Company' }, placeholder: 'Company', variant: "outlined", classes: textFieldClasses })),
                React.createElement(TextField, { name: 'team', type: 'hidden', value: 1, inputRef: register }))),
            !team && (React.createElement("div", null,
                React.createElement(Checkbox, { name: 'rememberMe', label: 'Keep me signed in until I sign out', ref: register }))),
            React.createElement(Grid, { item: true, xs: 12 },
                React.createElement(Button, { onClick: handleSubmit(onSubmit), variant: "contained", color: "primary", disableElevation: true, className: classes.submitBtn, disabled: isSubmitting }, isSubmitting ? (React.createElement(Loading, { size: 39, fillColor: '#FFF' })) : team && (team.isLogin || team.isInvitation) ? (team.submitText) : ('Sign In'))),
            !team && (React.createElement(Grid, { item: true, xs: 12 },
                React.createElement("div", { className: classes.forgotPassword },
                    React.createElement("a", { target: "_blank", href: "/reset-password" }, "Forgot password?")))),
            isModal && (React.createElement(React.Fragment, null,
                React.createElement(Grid, { item: true, xs: 12, className: classes.separator },
                    React.createElement(Divider, null)),
                React.createElement(Grid, { item: true, xs: 12 },
                    React.createElement("div", { className: classes.member },
                        "Not a member yet?\u00A0",
                        React.createElement("button", { className: "link", onClick: handleSignUp }, "Sign Up"))))),
            React.createElement("div", { ref: loginFormState.recaptcha.recaptchaRef, className: "grecaptcha" }))));
}
//# sourceMappingURL=LoginForm.js.map