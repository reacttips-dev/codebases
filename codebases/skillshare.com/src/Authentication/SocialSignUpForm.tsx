import React from 'react';
import { createStyles, Divider, Grid, makeStyles } from '@material-ui/core';
import { SignUpTerms } from './SignUpTerms';
import { SocialButtonContent } from './SocialButtonContent';
export var useSocialSignUpFormStyles = makeStyles(function (_a) {
    var spacing = _a.spacing, typography = _a.typography, palette = _a.palette;
    return createStyles({
        grid: {
            '& .MuiGrid-item': {
                marginBottom: spacing(1.5),
            },
        },
        formSeparator: {
            borderColor: palette.secondary.main,
            borderTopWidth: spacing(0.125),
            borderStyle: 'solid',
            height: spacing(0.125),
            margin: spacing(1.75, 0),
            '& p': {
                fontFamily: typography.fontFamily,
                color: palette.secondary.main,
                fontSize: typography.fontSize - 1,
                fontWeight: typography.fontWeightBold,
                textAlign: 'center',
                margin: spacing(-1.125, 'auto'),
                backgroundColor: palette.common.white,
                display: 'block',
                width: spacing(3.75),
            },
        },
        center: {
            textAlign: 'center',
            '&.MuiGrid-item': {
                marginBottom: function (_a) {
                    var hideLogin = _a.hideLogin;
                    return (hideLogin ? spacing(2) : spacing(1.5));
                },
            },
        },
        buttonLink: {
            borderStyle: 'none',
            background: 'none',
            fontFamily: typography.fontFamily,
            fontSize: typography.body2.fontSize,
            fontWeight: typography.fontWeightBold,
            color: palette.tertiary.main,
            '&:hover': {
                textDecoration: 'underline',
            },
        },
        member: {
            paddingTop: spacing(1.75),
            fontFamily: typography.fontFamily,
            fontSize: typography.body1.fontSize,
        },
        separator: {
            '& hr': {
                backgroundColor: palette.secondary.main,
                margin: spacing(1.75, 0),
            },
        },
        terms: {
            '&.MuiGrid-item': {
                marginBottom: 0,
            },
        },
    });
});
export function SocialSignUpForm(props) {
    var redirectTo = props.redirectTo, _a = props.hideLogin, hideLogin = _a === void 0 ? false : _a, _b = props.excludeTitle, excludeTitle = _b === void 0 ? false : _b, switchToEmailSignUp = props.switchToEmailSignUp, _c = props.switchToLogin, switchToLogin = _c === void 0 ? function () { } : _c;
    var classes = useSocialSignUpFormStyles(props);
    var handleEmailSignUp = function (event) {
        event.preventDefault();
        switchToEmailSignUp(true);
    };
    var handleLogin = function (event) {
        event.preventDefault();
        switchToLogin(true);
    };
    return (React.createElement(Grid, { container: true, className: classes.grid },
        React.createElement(SocialButtonContent, { redirectTo: redirectTo, isSignUp: true }),
        React.createElement(Grid, { item: true, xs: 12 },
            React.createElement("div", { className: "form-separator " + classes.formSeparator },
                React.createElement("p", null, "or"))),
        React.createElement(Grid, { item: true, xs: 12, className: classes.center },
            React.createElement("button", { className: classes.buttonLink, onClick: handleEmailSignUp }, excludeTitle ? 'Sign up using Email' : 'Sign Up Using Email')),
        !hideLogin && (React.createElement(React.Fragment, null,
            React.createElement(Grid, { item: true, xs: 12, className: classes.center },
                React.createElement("div", { className: classes.member },
                    "Already a member?\u00A0",
                    React.createElement("button", { className: classes.buttonLink, onClick: handleLogin }, "Sign In"))),
            React.createElement(Grid, { item: true, xs: 12, className: classes.separator },
                React.createElement(Divider, null)))),
        React.createElement(Grid, { className: classes.terms, item: true, xs: 12 },
            React.createElement(SignUpTerms, { hideCaptchaTerms: true }))));
}
//# sourceMappingURL=SocialSignUpForm.js.map