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
import React, { useState } from 'react';
import { Card, Grid, Typography } from '@material-ui/core';
import { EmailSignUpForm } from './EmailSignUpForm';
import { useEmbeddedSignUpCardStyles, useEmbeddedSignUpStyles } from './EmbeddedSignUpTypes';
import { SocialSignUpForm } from './SocialSignUpForm';
var EmbeddedSignUpHeader = function (_a) {
    var titleClass = _a.titleClass, subTitleClass = _a.subTitleClass, _b = _a.excludeTitle, excludeTitle = _b === void 0 ? false : _b;
    return (React.createElement(React.Fragment, null,
        !excludeTitle && (React.createElement(Typography, { component: "h2", variant: "h1", className: titleClass }, "Explore your creativity")),
        React.createElement(Typography, { component: "h3", variant: "h2", className: subTitleClass }, excludeTitle ? 'Get Started for Free' : 'Get started for free')));
};
export function EmbeddedSignUp(props) {
    var redirectTo = props.redirectTo, _a = props.onlyEmail, onlyEmail = _a === void 0 ? false : _a, header = props.header, _b = props.config, config = _b === void 0 ? {} : _b, _c = props.signUpCta, signUpCta = _c === void 0 ? 'Sign Up' : _c, _d = props.excludeTitle, excludeTitle = _d === void 0 ? false : _d, _e = props.hideFirstLastName, hideFirstLastName = _e === void 0 ? false : _e;
    var _f = __read(useState(onlyEmail), 2), isEmailFormOpen = _f[0], setIsEmailFormOpen = _f[1];
    var cardClasses = useEmbeddedSignUpCardStyles(props);
    var classes = useEmbeddedSignUpStyles();
    var cardClass = cardClasses.root + " " + (config.isMUIResponsive ? cardClasses.cardMui : '');
    var formClass = classes.form + " " + (config.isMUIResponsive ? classes.formMui : '');
    return (React.createElement(Grid, { container: true },
        React.createElement(Card, { className: cardClass },
            React.createElement(Grid, { className: formClass },
                header ? (React.createElement(React.Fragment, null,
                    " ",
                    header,
                    " ")) : (React.createElement(EmbeddedSignUpHeader, { titleClass: classes.marketing, subTitleClass: excludeTitle ? classes['subTitle-gr_locd_atf'] : classes.subTitle, excludeTitle: excludeTitle })),
                React.createElement("div", { className: classes.formContainer }, isEmailFormOpen ? (React.createElement(EmailSignUpForm, { redirectTo: redirectTo, isModal: false, signUpCta: signUpCta, hideLogin: true, hideFirstLastName: hideFirstLastName })) : (React.createElement(SocialSignUpForm, { redirectTo: redirectTo, switchToEmailSignUp: setIsEmailFormOpen, excludeTitle: excludeTitle, hideLogin: true }))),
                config.bottomMobileIcon && React.createElement("div", { className: classes.iconContainer }, config.bottomMobileIcon)))));
}
//# sourceMappingURL=EmbeddedSignUp.js.map