import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core';
import { monolithEmbeddedStarts, monolithLStarts, monolithMStart } from './EmbeddedSignUpTypes';
var useStyles = makeStyles(function (_a) {
    var _b;
    var spacing = _a.spacing, typography = _a.typography, palette = _a.palette;
    return createStyles({
        terms: {
            fontFamily: typography.fontFamily,
            fontSize: typography.caption.fontSize,
            color: palette.border.main,
            textAlign: function (_a) {
                var hideCaptchaTerms = _a.hideCaptchaTerms;
                return (hideCaptchaTerms ? 'center' : 'start');
            },
            '& a': (_b = {
                    display: 'inline',
                    fontWeight: typography.fontWeightBold,
                    fontSize: spacing(1.5),
                    textDecoration: 'none',
                    color: palette.secondary.main,
                    '&:hover': {
                        textDecoration: 'underline',
                    }
                },
                _b["@media (min-width:" + monolithMStart + "px)"] = {
                    display: 'inline-block',
                },
                _b["@media (min-width:" + monolithEmbeddedStarts + "px)"] = {
                    display: 'inline',
                },
                _b["@media (min-width:" + monolithLStarts + "px)"] = {
                    display: 'inline-block',
                },
                _b),
        },
    });
});
export function SignUpTerms(props) {
    var _a = props.hideCaptchaTerms, hideCaptchaTerms = _a === void 0 ? false : _a;
    var classes = useStyles(props);
    return (React.createElement("p", { className: classes.terms },
        "By signing up you agree to Skillshare's\u00A0",
        React.createElement("a", { target: "_blank", href: "/terms" }, "Terms of Service"),
        "\u00A0and\u00A0",
        React.createElement("a", { target: "_blank", href: "/privacy" }, "Privacy Policy."),
        !hideCaptchaTerms && (React.createElement(React.Fragment, null,
            "\u00A0This page is protected by reCAPTCHA and is subject to Google's\u00A0",
            React.createElement("a", { target: "_blank", rel: "noreferrer", href: "https://policies.google.com/terms" }, "Terms of Service"),
            "\u00A0and\u00A0",
            React.createElement("a", { target: "_blank", rel: "noreferrer", href: "https://policies.google.com/privacy" }, "Privacy Policy.")))));
}
//# sourceMappingURL=SignUpTerms.js.map