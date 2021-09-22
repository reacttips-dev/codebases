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
import { InputError, InputField } from '../../Input';
import { useAntiBotTokens, useCookies, useEventListener, useRecaptcha, useRequest } from '../../shared/hooks';
import { AppleButton, Button, FaceBookButton, GoogleButton } from '../buttons';
import { AuthModalContext } from '../providers';
import { EmailSignUpFormStyle } from './email-signup-form.style';
import { SignUpTerms } from './signup-terms';
import { useAppleLogin } from './use-apple-login';
import { useFacebookLogin } from './use-facebook-login';
import { useGoogleLogin } from './use-google-login';
var schema = object().shape({
    firstName: string()
        .trim()
        .max(50, 'Name fields must be fewer than 50 characters')
        .required('First Name is required'),
    lastName: string().trim().max(50, 'Name fields must be fewer than 50 characters').required('Last Name is required'),
    team: number(),
    teamName: string().when('team', {
        is: 1,
        then: string().required('Company is required'),
    }),
    email: string()
        .trim()
        .min(5, 'Email field must have at least 5 characters')
        .max(100, 'Email field must be fewer than 100 characters')
        .email('Email field is not a valid email address.')
        .required('Email is required'),
    password: string()
        .trim()
        .min(8, 'Password field must have at least 8 characters')
        .max(64, 'Password field must be fewer than 64 characters')
        .required('Password is required'),
});
export var EmailSignUpForm = function (_a) {
    var _b = _a.isModal, isModal = _b === void 0 ? true : _b, redirectTo = _a.redirectTo, _c = _a.showSocialLogins, showSocialLogins = _c === void 0 ? true : _c, team = _a.team;
    var _d = useRecaptcha(), isRecaptchaLoading = _d.isRecaptchaLoading, recaptchaResponse = _d.recaptchaResponse, recaptchaRef = _d.recaptchaRef, executeRecaptcha = _d.executeRecaptcha, recaptchaError = _d.recaptchaError;
    var execute = useRequest({ isAjaxRequest: true }).execute;
    var appleSignUp = useAppleLogin().appleSignUp;
    var _e = useFacebookLogin(redirectTo), facebookSignup = _e.facebookSignup, isFacebookLoading = _e.isFacebookLoading;
    var _f = useGoogleLogin(redirectTo), googleSignup = _f.googleSignup, isGoogleLoading = _f.isGoogleLoading;
    var authContext = useContext(AuthModalContext);
    var _g = __read(useState(''), 2), generalError = _g[0], setGeneralError = _g[1];
    var _h = __read(useState(false), 2), isSubmitting = _h[0], setIsSubmitting = _h[1];
    var tokens = useAntiBotTokens().tokens;
    var cookies = useCookies().cookies;
    var csrfToken = cookies && cookies.YII_CSRF_TOKEN ? cookies.YII_CSRF_TOKEN : '';
    var _j = useForm({
        mode: 'onSubmit',
        validationSchema: schema,
    }), register = _j.register, handleSubmit = _j.handleSubmit, errors = _j.errors, setError = _j.setError, clearError = _j.clearError, getValues = _j.getValues, triggerValidation = _j.triggerValidation, setValue = _j.setValue;
    if (team && team.invitation) {
        setValue('email', team.invitation.email);
    }
    var enterKeyHandler = function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var validationResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(event.keyCode === 13)) return [3, 2];
                    event.preventDefault();
                    return [4, triggerValidation([
                            { name: 'firstName' },
                            { name: 'lastName' },
                            { name: 'email' },
                            { name: 'password' },
                        ])];
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
    useEffect(function () {
        if (recaptchaResponse && recaptchaResponse !== '') {
            submitForm();
        }
    }, [recaptchaResponse]);
    var onSubmit = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!isRecaptchaLoading && recaptchaRef.current) {
                executeRecaptcha();
            }
            else {
                setGeneralError('Something went wrong. Please try again.');
            }
            return [2];
        });
    }); };
    var submitForm = function () { return __awaiter(void 0, void 0, void 0, function () {
        var data, postData, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = getValues();
                    postData = getPostData(data);
                    setIsSubmitting(true);
                    clearError();
                    setGeneralError('');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4, execute({ url: '/ajaxsignup', data: postData, method: 'POST' })];
                case 2:
                    response = _a.sent();
                    window.location = response.data.redirectTo;
                    return [3, 4];
                case 3:
                    error_1 = _a.sent();
                    handleErrorResponse(error_1);
                    setIsSubmitting(false);
                    return [3, 4];
                case 4: return [2];
            }
        });
    }); };
    var getPostData = function (data) {
        var postData = new URLSearchParams();
        postData.append('SignupForm[firstName]', data.firstName);
        postData.append('SignupForm[lastName]', data.lastName);
        postData.append('SignupForm[email]', data.email);
        postData.append('SignupForm[password]', data.password);
        postData.append('SignupForm[timestamp]', tokens.timestamp);
        postData.append('SignupForm[deviceVerificationToken]', tokens.deviceVerificationToken);
        postData.append('YII_CSRF_TOKEN', csrfToken);
        postData.append('recaptcha', recaptchaResponse ? recaptchaResponse : '');
        if (team) {
            if (team.isSignUp) {
                postData.append('SignupForm[teamName]', data.teamName);
            }
            if (team.isInvitation && team.invitation) {
                postData.append('SignupForm[teamInviteId]', team.invitation.id.toString());
            }
        }
        if (redirectTo) {
            postData.append('SignupForm[redirectTo]', redirectTo);
        }
        return postData;
    };
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
        var inputErrorFields = intersection(schema._nodes, keys(errors));
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
            authContext.api.updateIsLogin(true);
            return;
        }
        window.location.pathname = '/login';
    };
    var handleFacebookSignUp = function (event) {
        event.preventDefault();
        facebookSignup();
    };
    var handleGoogleSignUp = function (event) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.preventDefault();
                    return [4, googleSignup()];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    }); };
    var handleAppleSignUp = function (event) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.preventDefault();
                    return [4, appleSignUp()];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    }); };
    return (React.createElement(EmailSignUpFormStyle, null,
        React.createElement("form", null,
            showSocialLogins && (React.createElement(React.Fragment, null,
                React.createElement(FaceBookButton, { isFacebookLoading: isFacebookLoading, text: 'Continue with Facebook', onClick: handleFacebookSignUp }),
                React.createElement(GoogleButton, { isGoogleLoading: isGoogleLoading, text: 'Continue with Google', onClick: handleGoogleSignUp }),
                React.createElement(AppleButton, { text: 'Continue with Apple', onClick: handleAppleSignUp }),
                React.createElement("div", { className: "form-separator" },
                    React.createElement("p", null, "or")))),
            React.createElement(InputError, { error: (errors.firstName && errors.firstName.message) ||
                    (errors.lastName && errors.lastName.message) ||
                    (generalError && generalError) ||
                    (recaptchaError && recaptchaError) }),
            React.createElement("div", { className: "name-inputs" },
                React.createElement("div", { className: "input" },
                    React.createElement(InputField, { placeholder: 'First name', "aria-label": 'First name', type: 'text', name: 'firstName', className: 'first-name', ref: register })),
                React.createElement("div", { className: "input" },
                    React.createElement(InputField, { placeholder: 'Last name', "aria-label": 'Last name', type: 'text', name: 'lastName', className: 'last-name', ref: register }))),
            team && team.isSignUp && (React.createElement(React.Fragment, null,
                React.createElement(InputError, { error: errors.teamName && errors.teamName.message }),
                React.createElement(InputField, { placeholder: 'Company', "aria-label": 'Company', type: 'text', name: 'teamName', className: 'signup-inputs', ref: register }),
                React.createElement(InputField, { type: 'hidden', name: 'team', value: 1, ref: register }))),
            React.createElement(InputError, { error: errors.email && errors.email.message }),
            React.createElement(InputField, { placeholder: 'Email address', "aria-label": 'Email address', type: 'email', name: 'email', className: "signup-inputs" + (team && team.invitation ? ' bold' : ''), ref: register, readOnly: team && team.invitation ? true : false }),
            React.createElement(InputError, { error: errors.password && errors.password.message }),
            React.createElement(InputField, { placeholder: 'Create password', "aria-label": 'Password', type: 'password', name: 'password', ref: register }),
            React.createElement("div", { className: "pass-requirement" }, "Password must be at least 8 characters long.\u00A0"),
            React.createElement("div", { ref: recaptchaRef, className: "grecaptcha" }),
            React.createElement(Button, { onClick: handleSubmit(onSubmit), text: team && (team.isSignUp || team.isInvitation) ? team.submitText : 'Sign Up', className: "submit-btn" + (team ? ' team' : ''), loading: isSubmitting }),
            React.createElement("input", { type: "hidden", name: "timestamp", ref: register }),
            React.createElement("input", { type: "hidden", name: "deviceVerificationToken", ref: register })),
        !team && (React.createElement("div", null,
            React.createElement("div", { className: "login" },
                "Already a member?\u00A0",
                React.createElement("button", { className: "link", onClick: onClickLogin }, "Sign In")),
            React.createElement("div", { className: "form-separator" }),
            React.createElement(SignUpTerms, null)))));
};
//# sourceMappingURL=email-signup-form.js.map