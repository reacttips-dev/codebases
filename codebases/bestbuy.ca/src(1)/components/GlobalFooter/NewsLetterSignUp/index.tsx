var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { utils as adobeLaunch } from "@bbyca/adobe-launch";
import { GlobalErrorMessage } from "@bbyca/bbyca-components";
import { Newsletter, NewsletterProvider } from "@bbyca/ecomm-communications-components";
import * as React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import SocialIcons from "./SocialIcons";
import * as styles from "./style.css";
import messages from "./translations/messages";
export class NewsLetterSignUp extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = (type, e, data) => __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            const { locale, newsLetterApiUrl } = this.props;
            this.setState({ loading: true });
            const newsletterApiProvider = new NewsletterProvider(newsLetterApiUrl);
            try {
                yield newsletterApiProvider.addSubscriber({
                    email: data.email.value,
                    locale,
                    optedOut: false,
                    postalCode: data.postalCode && data.postalCode.value,
                });
                this.setState({ submitted: true });
                adobeLaunch.pushEventToDataLayer({
                    event: "FOOTER_NEWSLETTER_SIGNUP_SUCCESS",
                });
            }
            catch (error) {
                this.setState({ error });
                adobeLaunch.pushEventToDataLayer({
                    event: "FOOTER_NEWSLETTER_SIGNUP_FAIL",
                    error,
                });
            }
            finally {
                this.setState({ loading: false });
            }
        });
        this.state = { loading: false, submitted: false, error: undefined };
    }
    render() {
        const { locale, localizedMessages, intl } = this.props;
        const { loading, submitted, error } = this.props && this.state;
        return (React.createElement("div", { className: styles.newsLetterContainer },
            !submitted ?
                React.createElement(React.Fragment, null,
                    React.createElement("div", { className: styles.title },
                        React.createElement(FormattedMessage, Object.assign({}, messages.title))),
                    React.createElement("div", { className: styles.subTitle },
                        React.createElement(FormattedMessage, Object.assign({}, messages.subTitle))),
                    React.createElement("div", { className: styles.newsLetterInputContainer },
                        error && React.createElement(GlobalErrorMessage, { message: intl.formatMessage({ id: messages.error.id }) }),
                        React.createElement(Newsletter, { handleSubmit: this.handleSubmit, isLoading: loading, privacyPolicyLink: "", intl: { messages: localizedMessages } }))) :
                React.createElement(React.Fragment, null,
                    React.createElement("div", { className: styles.signedUpMessageTitle },
                        React.createElement(FormattedMessage, Object.assign({}, messages.signedUpMessageTitle))),
                    React.createElement("div", { className: styles.signedUpMessageSubTitle },
                        React.createElement(FormattedMessage, Object.assign({}, messages.signedUpMessageSubTitle)))),
            React.createElement(SocialIcons, { locale: locale })));
    }
}
export default injectIntl(NewsLetterSignUp);
//# sourceMappingURL=index.js.map