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
import clsx from 'clsx';
import { difference, intersection, keys } from 'lodash';
import useForm from 'react-hook-form';
import { Button, Divider, Grid, TextField } from '@material-ui/core';
import { Loading } from '../Loading/Loading';
import { useEnvironment, useEventListener } from '../shared/hooks';
import { EmailSignUpFormSchema, EmailSignUpFormSchemaNoLastName, enterKeyPress, getPostData, useEmailSignUpFormStyles, } from './EmailSignUpFormTypes';
import { SignUpTerms } from './SignUpTerms';
import { SocialButtonContent } from './SocialButtonContent';
import { useTextFieldErrorStyles, useTextFieldStyles } from './TextFieldStyles';
import { useAuthFormState } from './useAuthFormState';
export function EmailSignUpForm(props) {
    var _this = this;
    var _a = props.isModal, isModal = _a === void 0 ? true : _a, redirectTo = props.redirectTo, _b = props.showSocialLogins, showSocialLogins = _b === void 0 ? true : _b, team = props.team, _c = props.hideLogin, hideLogin = _c === void 0 ? false : _c, signUpCta = props.signUpCta, _d = props.switchToLoginForm, switchToLoginForm = _d === void 0 ? function () { } : _d, _e = props.hideFirstLastName, hideFirstLastName = _e === void 0 ? false : _e;
    var classes = useEmailSignUpFormStyles(props);
    var textFieldClasses = useTextFieldStyles();
    var textFieldErrorClasses = useTextFieldErrorStyles();
    var emailSignUpState = useAuthFormState();
    var appHost = useEnvironment().appHost;
    var _f = __read(useState(''), 2), generalError = _f[0], setGeneralError = _f[1];
    var _g = __read(useState(false), 2), isSubmitting = _g[0], setIsSubmitting = _g[1];
    var _h = useForm({
        mode: 'onSubmit',
        validationSchema: hideFirstLastName ? EmailSignUpFormSchemaNoLastName : EmailSignUpFormSchema,
    }), register = _h.register, handleSubmit = _h.handleSubmit, errors = _h.errors, setError = _h.setError, clearError = _h.clearError, getValues = _h.getValues, triggerValidation = _h.triggerValidation, setValue = _h.setValue;
    if (team && team.invitation) {
        setValue('email', team.invitation.email);
    }
    var enterKeyHandler = function (event) {
        enterKeyPress({ event: event, validate: triggerValidation, onSubmit: onSubmit });
    };
    useEventListener({ eventName: 'keydown', handler: enterKeyHandler });
    useEffect(function () {
        if (emailSignUpState.recaptcha.recaptchaResponse && emailSignUpState.recaptcha.recaptchaResponse !== '') {
            submitForm();
        }
    }, [emailSignUpState.recaptcha.recaptchaResponse]);
    var onSubmit = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!emailSignUpState.recaptcha.isRecaptchaLoading && emailSignUpState.recaptcha.recaptchaRef.current) {
                emailSignUpState.recaptcha.executeRecaptcha();
            }
            else {
                setGeneralError('Something went wrong. Please try again.');
            }
            return [2];
        });
    }); };
    var submitForm = function () { return __awaiter(_this, void 0, void 0, function () {
        var data, urlParams, urlRedirectTo, postData, origin_1, response, error_1;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    data = getValues();
                    urlParams = new URLSearchParams((_b = (_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.search) !== null && _b !== void 0 ? _b : '');
                    urlRedirectTo = (_c = redirectTo !== null && redirectTo !== void 0 ? redirectTo : urlParams.get('redirectTo')) !== null && _c !== void 0 ? _c : '';
                    if (hideFirstLastName) {
                        data.firstName = 'Skillshare Member';
                        data.lastName = ' ';
                    }
                    postData = getPostData({
                        data: data,
                        recaptchaResponse: emailSignUpState.recaptcha.recaptchaResponse,
                        redirectTo: urlRedirectTo,
                        tokens: emailSignUpState.tokens,
                        csrfToken: emailSignUpState.csrfToken,
                        team: team,
                    });
                    setIsSubmitting(true);
                    clearError();
                    setGeneralError('');
                    _g.label = 1;
                case 1:
                    _g.trys.push([1, 3, , 4]);
                    origin_1 = (_f = (_e = (_d = window === null || window === void 0 ? void 0 : window.location) === null || _d === void 0 ? void 0 : _d.origin) !== null && _e !== void 0 ? _e : appHost) !== null && _f !== void 0 ? _f : '';
                    return [4, emailSignUpState.request.execute({
                            url: origin_1 + "/ajaxsignup",
                            data: postData,
                            method: 'POST',
                        })];
                case 2:
                    response = _g.sent();
                    window.location = response.data.redirectTo;
                    return [3, 4];
                case 3:
                    error_1 = _g.sent();
                    handleErrorResponse(error_1);
                    setIsSubmitting(false);
                    return [3, 4];
                case 4: return [2];
            }
        });
    }); };
    var handleErrorResponse = function (error) {
        if (error.response.status >= 500) {
            setGeneralError('Something went wrong. Please try again later');
            return;
        }
        var errors = error.response.data.errors;
        if (typeof errors === 'string') {
            setGeneralError(errors);
            return;
        }
        var inputErrorFields = intersection(EmailSignUpFormSchema._nodes, keys(errors));
        inputErrorFields.forEach(function (field) {
            setError(field, '', errors[field][0]);
        });
        var generalErrorFields = difference(keys(errors), inputErrorFields);
        generalErrorFields.forEach(function (field) {
            setGeneralError(errors[field][0]);
        });
    };
    var onClickLogin = function (event) {
        event.preventDefault();
        if (isModal) {
            switchToLoginForm(true);
            return;
        }
        window.location.pathname = '/login';
    };
    var errorClass = clsx('error', textFieldErrorClasses.root);
    return (React.createElement("form", { autoComplete: "off" },
        React.createElement(Grid, { container: true, className: classes.grid },
            showSocialLogins && (React.createElement(React.Fragment, null,
                React.createElement(SocialButtonContent, { isSignUp: true, redirectTo: redirectTo }),
                React.createElement(Grid, { item: true, xs: 12 },
                    React.createElement("div", { className: "form-separator " + classes.formSeparator },
                        React.createElement("p", null, "or"))))),
            (errors.firstName && React.createElement("p", { className: errorClass }, errors.firstName.message)) ||
                (errors.lastName && React.createElement("p", { className: errorClass }, errors.lastName.message)) ||
                (generalError && React.createElement("p", { className: errorClass }, generalError)) ||
                (emailSignUpState.recaptcha.recaptchaError && (React.createElement("p", { className: errorClass }, emailSignUpState.recaptcha.recaptchaError))),
            hideFirstLastName ? null : (React.createElement(Grid, { container: true, item: true, xs: 12, justify: "space-between", direction: "row" },
                React.createElement(TextField, { name: 'firstName', inputRef: register, inputProps: { 'aria-label': 'First name' }, placeholder: 'First name', variant: "outlined", classes: textFieldClasses, className: classes.nameField }),
                React.createElement(TextField, { name: 'lastName', inputRef: register, inputProps: { 'aria-label': 'Last name' }, placeholder: 'Last name', variant: "outlined", classes: textFieldClasses, className: classes.nameField }))),
            team && team.isSignUp && (React.createElement(React.Fragment, null,
                errors.teamName && React.createElement("p", { className: errorClass }, errors.teamName.message),
                React.createElement(Grid, { item: true, xs: 12 },
                    React.createElement(TextField, { name: 'teamName', inputRef: register, inputProps: { 'aria-label': 'Company' }, placeholder: 'Company', variant: "outlined", classes: textFieldClasses })),
                React.createElement(TextField, { name: 'team', type: 'hidden', value: 1, inputRef: register }))),
            errors.email && React.createElement("p", { className: errorClass }, errors.email.message),
            React.createElement(Grid, { item: true, xs: 12 },
                React.createElement(TextField, { name: 'email', type: 'email', inputRef: register, inputProps: {
                        'aria-label': 'Email address',
                        className: team && team.invitation ? 'bold' : 'normal',
                        readOnly: team && team.invitation ? true : false,
                    }, placeholder: 'Email address', variant: "outlined", classes: textFieldClasses, className: 'bold' })),
            errors.password && React.createElement("p", { className: errorClass }, errors.password.message),
            React.createElement(Grid, { item: true, xs: 12, className: classes.passwordSpacing },
                React.createElement(TextField, { inputRef: register, name: 'password', type: 'password', inputProps: { 'aria-label': 'Password' }, placeholder: 'Create password', variant: "outlined", classes: textFieldClasses })),
            React.createElement(Grid, { item: true, xs: 12 },
                React.createElement("p", { className: classes.passwordRequirement }, "Password must be at least 8 characters long.")),
            React.createElement(Grid, { item: true, xs: 12 },
                React.createElement(Button, { onClick: handleSubmit(onSubmit), variant: "contained", color: "primary", disableElevation: true, className: clsx('submit-btn', classes.submitBtn), disabled: isSubmitting, "data-cy": "signup-embedded-btn" }, isSubmitting ? (React.createElement(Loading, { size: 39, fillColor: '#FFF' })) : team && (team.isSignUp || team.isInvitation) ? (team.submitText) : (signUpCta !== null && signUpCta !== void 0 ? signUpCta : 'Sign Up'))),
            !team && (React.createElement(React.Fragment, null,
                !hideLogin && (React.createElement(React.Fragment, null,
                    React.createElement(Grid, { item: true, xs: 12 },
                        React.createElement("div", { className: classes.member },
                            "Already a member?\u00A0",
                            React.createElement("button", { className: "link", onClick: onClickLogin }, "Sign In"))),
                    React.createElement(Grid, { item: true, xs: 12, className: classes.separator },
                        React.createElement(Divider, null)))),
                React.createElement(Grid, { className: classes.terms, item: true, xs: 12 },
                    React.createElement(SignUpTerms, null)))),
            React.createElement("div", { ref: emailSignUpState.recaptcha.recaptchaRef, className: "grecaptcha" }))));
}
//# sourceMappingURL=EmailSignUpForm.js.map