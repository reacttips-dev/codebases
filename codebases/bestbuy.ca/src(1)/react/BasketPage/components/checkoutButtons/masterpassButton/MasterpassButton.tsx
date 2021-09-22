import { CookieUtils } from "@bbyca/bbyca-components";
import * as React from "react";
import CheckoutButton from "../../../../../containers/CheckoutButtonContainer";
import * as styles from "./styles.css";
export default class MasterpassButton extends React.Component {
    constructor() {
        super(...arguments);
        this.handleClick = () => {
            if (this.props.masterpassConfig.isEnabled && masterpass) {
                setTimeout(() => {
                    masterpass.checkout({
                        allowedCardTypes: [this.props.masterpassConfig.allowedCardTypes],
                        amount: `${this.props.cart.totalPurchasePrice}`,
                        cartId: this.props.cart.id,
                        checkoutId: this.props.masterpassConfig.checkoutId,
                        currency: "CAD",
                    });
                    this.props.onClicked();
                }, 300);
            }
        };
    }
    componentDidMount() {
        if (this.props.masterpassConfig.isEnabled && !CookieUtils.getCookie("AppMode")) {
            let masterpassScript = document.getElementById("masterpassScript");
            if (!masterpassScript) {
                masterpassScript = document.createElement("script");
                masterpassScript.id = "masterpassScript";
                masterpassScript.src = this.props.masterpassConfig.jsLibraryUrl;
                document.body.appendChild(masterpassScript);
            }
        }
    }
    render() {
        if (this.props.masterpassConfig.isEnabled && !CookieUtils.getCookie("AppMode")) {
            return (React.createElement("div", null,
                React.createElement(CheckoutButton, { onCheckout: this.handleClick },
                    React.createElement("button", { className: styles.masterpassButton },
                        React.createElement("img", { className: styles.masterpassButtonImage, src: this.props.masterpassConfig.buttonImageUrl })))));
        }
        return "";
    }
}
//# sourceMappingURL=MasterpassButton.js.map