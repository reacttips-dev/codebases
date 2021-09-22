var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from "react";
import CheckoutButton from "../../../../../containers/CheckoutButtonContainer";
import * as styles from "./styles.css";
export default class VisaCheckoutButton extends React.Component {
    constructor() {
        super(...arguments);
        this.initData = {
            apikey: this.props.visaCheckout.apiKey,
            paymentRequest: {
                currencyCode: "CAD",
                total: this.props.cart.totalPurchasePrice.toString(),
            },
            settings: {
                countryCode: "CA",
                displayName: "Best Buy Canada",
                locale: this.props.lang,
                logoUrl: "http://images.bbycastatic.ca/sf/scripts/core-assets/images/assets/logo.svg",
                payment: {
                    acceptCanadianVisaDebit: "true",
                    billingCountries: ["US", "CA"],
                    cardBrands: ["VISA", "MASTERCARD", "AMEX"],
                },
                websiteUrl: "www.bestbuy.ca",
            },
        };
        this.onVisaCheckout = () => {
            this.props.onRegisterVisa();
            window.V.init(this.initData);
            document.querySelector(".v-button").click();
        };
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            window.onVisaCheckoutReady = () => {
                const V = window.V;
                V.init(this.initData);
                V.on("payment.success", (payment) => {
                    const compactedPayment = { callId: payment.callid, encKey: payment.encKey,
                        encPaymentData: payment.encPaymentData, partialShippingAddress: payment.partialShippingAddress };
                    document.cookie = `vcPayment=${JSON.stringify(compactedPayment)};path=/;`;
                    window.location.href = this.props.checkoutUri;
                });
                V.on("payment.cancel", (payment) => { return; });
                V.on("payment.error", (payment, error) => { return; });
            };
            let visaCheckoutScript = document.getElementById("visaCheckoutScript");
            if (!visaCheckoutScript) {
                const visaCheckoutButton = document.createElement("img");
                visaCheckoutButton.src = this.props.visaCheckout.buttonImageUrl;
                visaCheckoutButton.alt = "Visa Checkout";
                visaCheckoutButton.className = "v-button";
                visaCheckoutButton.setAttribute("role", "button");
                visaCheckoutButton.hidden = true;
                document.body.appendChild(visaCheckoutButton);
                visaCheckoutScript = document.createElement("script");
                visaCheckoutScript.id = "visaCheckoutScript";
                visaCheckoutScript.src = this.props.visaCheckout.jsLibraryUrl;
                document.body.appendChild(visaCheckoutScript);
            }
        });
    }
    render() {
        return (React.createElement(CheckoutButton, { onCheckout: this.onVisaCheckout },
            React.createElement("button", { className: styles.visaButton },
                React.createElement("img", { className: styles.visaButtonImage, alt: "visa checkout logo", src: this.props.visaCheckout.buttonImageUrl }))));
    }
}
//# sourceMappingURL=VisaCheckoutButton.js.map