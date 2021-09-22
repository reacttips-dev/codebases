import { Button, Form, hasPostalCodeChars, Input, isPostalCode, isValidEmailFormat, Link, maxLength, required, } from "@bbyca/bbyca-components";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import messages from "../Newsletter/translations/messages";
import * as styles from "./style.css";
export const Newsletter = ({ handleError, handleSubmit, isLoading, privacyPolicyLink, intl, advanced = false, }) => {
    return (React.createElement(Form, { onSubmit: handleSubmit, onError: handleError, scrollToErrors: false },
        React.createElement("div", { className: !advanced ? styles.formInlineContainer : styles.formContainer },
            React.createElement(Input, { className: !advanced ? styles.formEmailInputInlineButton : styles.formEmailInput, name: "email", validators: [required, isValidEmailFormat], errorMsg: intl.messages["pages.newsletter.email.error"], label: !advanced ? "" : intl.messages["pages.newsletter.email.address.label"], placeholder: !advanced ? intl.messages["pages.newsletter.email.address.label"] : "", extraAttrs: {
                    "data-automation": "email-address-input",
                    "type": "email",
                } }),
            advanced &&
                React.createElement(React.Fragment, null,
                    React.createElement("div", { className: styles.postalWrapper },
                        React.createElement(Input, { asyncValidators: [maxLength(6), hasPostalCodeChars], className: styles.formPostalCodeInput, name: "postalCode", validators: [required, isPostalCode], formatter: "*** ***", errorMsg: intl.messages["pages.newsletter.postalCode.error"], label: intl.messages["pages.newsletter.postalCode.label"], maxLength: 7, extraAttrs: {
                                "data-automation": "postalCode-input",
                                "type": "postalCode",
                            } })),
                    React.createElement("div", { className: `${styles.formItemInfo} ${styles.formPostalCodeInfo}`, "data-automation": "newsletter-form-postal-code-info" },
                        React.createElement(FormattedMessage, Object.assign({}, messages.newsletterPostalCodeInfo)))),
            React.createElement(Button, { className: !advanced ? styles.formButtonInlineButton : styles.formButton, appearance: "secondary", type: "submit", shouldFitContainer: false, isDisabled: isLoading, extraAttrs: {
                    "data-automation": "subscribe-newsletter-button",
                } },
                React.createElement(FormattedMessage, Object.assign({}, messages.newsletterSubscribeButton))),
            advanced &&
                React.createElement("div", { className: `${styles.formItemInfo} ${styles.newsletterDisclaimerText}`, "data-automation": "newsletter-email-sign-up-disclaimer-text" },
                    React.createElement(FormattedMessage, Object.assign({}, messages.newsletterSubscribeDisclaimerText)),
                    React.createElement(Link, { href: privacyPolicyLink, targetSelf: false, className: styles.newsletterPrivacyPolicyLink },
                        React.createElement(FormattedMessage, Object.assign({}, messages.newsletterSubscribeDisclaimerPrivacyPolicy))),
                    "."))));
};
export default Newsletter;
//# sourceMappingURL=Newsletter.js.map