import * as React from "react";
import AgeVerification from "../../ageVerification/AgeVerification";
import * as styles from "./styles.css";
export class CheckoutButtonWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.handleAgeVerificationCancel = () => this.setState({ showAgeVerification: false });
        this.handleAgeVerificationAccept = (e) => {
            this.setState({ showAgeVerification: false });
            if (this.props.onCheckout) {
                this.addAnalyticsEvent();
                this.props.onCheckout(e);
            }
        };
        this.handleCheckoutClick = (e) => {
            if (e && e.currentTarget && e.currentTarget.blur) {
                e.currentTarget.blur();
            }
            if (!this.props.disableAgeVerification && this.getAgeRestrictedItems().length) {
                if (e && e.preventDefault) {
                    e.preventDefault();
                }
                this.setState({ showAgeVerification: true });
            }
            else if (!!this.props.lineItemIDsForUnacceptedServicePlans.length) {
                if (e && e.preventDefault) {
                    e.preventDefault();
                }
                this.props.onServicePlansNotAccepted(this.props.lineItemIDsForUnacceptedServicePlans);
            }
            else {
                this.addAnalyticsEvent();
                if (this.props.onCheckout) {
                    this.props.onCheckout();
                }
            }
        };
        this.getAgeRestrictedItems = () => {
            if (!this.props.cart || !this.props.cart.shipments) {
                return [];
            }
            let items = this.props.cart.shipments.reduce(this.shipmentToLineItems, []);
            items = items.filter((item) => item.purchasable !== false
                && item.sku.product.requiresAgeVerification === true
                && item.removed !== true);
            return items;
        };
        this.addAnalyticsEvent = () => {
            if (window && sessionStorage) {
                // If a window does not have a parent, its parent property is a reference to itself.
                sessionStorage.setItem("AEDBacklog", JSON.stringify([{
                        event: "analytics-cart-continue-to-checkout",
                        parentLocation: window.parent.location,
                        state: { cart: this.props.cart },
                    }]));
            }
        };
        this.toFlattenedLineItem = () => (lineItem) => [Object.assign({}, lineItem), ...(lineItem.children || [])];
        this.shipmentToLineItems = (acc, shipment) => acc.concat(...shipment.lineItems.map(this.toFlattenedLineItem()));
        this.state = {
            showAgeVerification: false,
        };
    }
    render() {
        const RootElement = React.Children.only(this.props.children);
        return (React.createElement("div", { className: styles.checkoutButton },
            React.cloneElement(RootElement, Object.assign(Object.assign({}, RootElement.props), { onClick: this.handleCheckoutClick })),
            React.createElement(AgeVerification, { onAccept: this.handleAgeVerificationAccept, onCancel: this.handleAgeVerificationCancel, acceptLink: RootElement.props.href, visible: this.state.showAgeVerification, lineItems: this.getAgeRestrictedItems() })));
    }
}
export default CheckoutButtonWrapper;
//# sourceMappingURL=CheckoutButtonWrapper.js.map