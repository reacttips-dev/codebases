import * as React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import CheckoutButton from "../../../../../containers/CheckoutButtonContainer";
import * as p from "./img/p.svg";
import * as paypalButtonLogo from "./img/paypal-white.svg";
import * as paypal from "./img/paypal.svg";
import * as paypalLogo from "./img/paypallogo.svg";
import * as styles from "./styles.css";
import messages from "./translations/messages";
export class PaypalButton extends React.Component {
    constructor(props) {
        super(props);
        this.renderEmail = () => (React.createElement("div", null,
            React.createElement("span", { "data-automation": "paypal-email" }, this.props.paypalEmail),
            React.createElement("p", { className: styles.removePaypalButton, onClick: this.onClickRemoveHandler, "data-automation": "remove-paypal-button" }, this.props.intl.formatMessage(messages.unlinkPaypal))));
        this.renderButton = ({ href = "javascript:void(0);", isExpress, intl, hasDescription } = this.props) => (React.createElement(React.Fragment, null,
            this.paypalDescription(hasDescription),
            React.createElement(CheckoutButton, { disableAgeVerification: this.props.disableAgeVerification, onCheckout: this.onClickPaypalHandler },
                React.createElement("a", { className: styles.paypalButton, "data-automation": "paypal-button", href: href },
                    React.createElement("span", { className: styles.paypalContent }, isExpress ?
                        React.createElement(React.Fragment, null,
                            React.createElement("img", { className: styles.paypalButtonLogo, src: paypalButtonLogo }),
                            intl.formatMessage(messages.paypalButtonExpress)) :
                        React.createElement(React.Fragment, null,
                            intl.formatMessage(messages.paypalButton),
                            React.createElement("img", { className: styles.paypalButtonLogo, src: paypalButtonLogo })))))));
        this.paypalDescription = (hasDescription) => {
            if (hasDescription) {
                return (React.createElement("p", { className: styles.buttonDescription }, this.props.intl.formatMessage(messages.paypalDescription)));
            }
        };
        this.onClickPaypalHandler = () => {
            this.setState({ loading: true });
            this.props.onRegisterPaypal();
        };
        this.onClickRemoveHandler = () => {
            this.props.onRemovePaypal();
        };
        this.state = {
            loading: false,
        };
    }
    render() {
        const { paypalEmail, paypalError, className = "" } = this.props;
        const { loading } = this.state;
        return (React.createElement("div", { className: `${styles.paypalButtonContainer} ${className}` },
            paypalEmail && paypalEmail !== "" ? this.renderEmail() : this.renderButton(),
            (loading && !paypalError) &&
                React.createElement(PaypalLoader, null)));
    }
}
export const PaypalLoader = injectIntl((props) => (React.createElement("div", { className: styles.paypalLoadingOverlay, "data-automation": "paypal-loader" },
    React.createElement("div", { className: styles.paypalModal },
        React.createElement("div", { className: styles.paypalCheckoutLogo },
            React.createElement("img", { className: styles.paypalCheckoutLogoPp, alt: "paypal logo", src: p }),
            React.createElement("img", { className: styles.paypalCheckoutLogoPaypal, alt: "paypal", src: paypal })),
        React.createElement("p", { className: styles.paypalLoaderDescription },
            React.createElement(FormattedMessage, Object.assign({}, messages.paypalLoaderDescription))),
        React.createElement("div", null,
            React.createElement("div", { className: styles.paypalSpinner }))))));
export const PaypalLogo = () => React.createElement("img", { src: paypalLogo, alt: "paypal logo" });
export default injectIntl(PaypalButton);
//# sourceMappingURL=PaypalButton.js.map