var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { cieUtilities } from "@bbyca/account-components";
import { Button, ErrorToaster, GlobalWarningMessage, Loader } from "@bbyca/bbyca-components";
import CircularProgress from "@material-ui/core/CircularProgress";
import * as React from "react";
import { injectIntl } from "react-intl";
import * as url from "url";
import { CartStatus, } from "../../business-rules/entities";
import CheckoutButton from "../../containers/CheckoutButtonContainer";
import * as emptyCartIcon from "../../icons/emptyCart.svg";
import CostSummary from "../CostSummary/CostSummary";
import EnterPostalCode from "../EnterPostalCode/EnterPostalCode";
import { formatPrice, getEnRegionName } from "../utilities/formatting";
import { BasketShippingStatus, getShippingStatusSummaryForBasket } from "../utilities/shippingStatusHelper";
import { MasterpassButton, PaypalButton, VisaCheckoutButton } from "./components/checkoutButtons";
import OrderPromotionItems from "./components/orderPromotionItems";
import Shipment from "./components/shipment/Shipment";
import { ItemCount } from "./helpers/ItemCount";
import * as styles from "./styles.css";
import messages from "./translations/messages";
const EmptyCart = injectIntl((props) => (React.createElement("section", { className: styles.basketPage },
    React.createElement("div", { className: "empty-cart" },
        props.cart
            && props.cart.shipments
            && props.cart.shipments.map((shipment) => (React.createElement(Shipment, Object.assign({ key: "sellerId" + shipment.seller.id }, shipment, { onGoToPath: props.onGoToPath })))),
        React.createElement("div", { className: "text" },
            React.createElement("h2", null, props.intl.formatMessage(messages.emptyCartHeader)),
            React.createElement("p", null, props.intl.formatMessage(messages.emptyCartText))),
        React.createElement("img", { className: "empty-cart-icon", src: emptyCartIcon, alt: "empty cart" })))));
const ContinueToCheckout = injectIntl((props) => {
    const uri = props.isCsr ? props.checkoutUri :
        cieUtilities.buildSignInUrl(props.cieServiceUrl, props.lang, props.checkoutUri, "checkout");
    return (React.createElement(CheckoutButton, null,
        React.createElement(Button, { className: "continue-to-checkout", href: uri },
            React.createElement("div", { "data-automation": "continue-to-checkout" }, props.intl.formatMessage(messages.continueToCheckout)))));
});
/**
 * IMPORTANT!!!: THIS PAGE IS DEPRECATED for ecomm-webapp.
 * Rafael Rozon @ March, 2020
 *
 * UPDATE: Purchase family is using this page for CSR app.
 * Billy Hoang @ July, 2020
 */
export class BasketPage extends React.Component {
    constructor(props, state) {
        super(props, state);
        this.formatCheckoutUrl = () => {
            const checkoutUrl = url.parse(this.props.checkoutUri);
            let hash = `/${this.props.lang.toLowerCase()}/shipping`;
            if (this.props.regionCode && this.props.postalCode) {
                hash = hash.concat(`/${this.props.regionCode}/${this.props.postalCode}`);
            }
            checkoutUrl.hash = hash;
            if (this.props.isQueueItEnabled) {
                checkoutUrl.query = {
                    qit: "1",
                };
            }
            return url.format(checkoutUrl);
        };
        this.renderPostalCodeSection = () => (React.createElement("section", { className: "enter-pc-section" },
            React.createElement(EnterPostalCode, { postalCode: this.props.postalCode, changePostalCode: this.changePostalCode })));
        this.renderMasterpass = (formattedCheckoutUrl) => {
            return (React.createElement(MasterpassButton, { intl: this.props.intl, masterpassConfig: this.props.masterpassConfig, cart: {
                    id: this.props.cart.id,
                    totalPurchasePrice: this.props.cart.totalPurchasePrice,
                }, checkoutUri: formattedCheckoutUrl, onClicked: this.props.onMasterpassClicked }));
        };
        this.renderAdditionalCheckoutMethods = (formattedCheckoutUrl) => {
            const { intl, isLightweightBasketEnabled } = this.props;
            const paypalUri = formattedCheckoutUrl + "?expressPaypalCheckout=true";
            if (isLightweightBasketEnabled) {
                return null;
            }
            return (React.createElement(React.Fragment, null,
                React.createElement("div", { className: "button-seperation" }, this.props.intl.formatMessage(messages.or)),
                React.createElement("div", { className: "checkout-options" },
                    React.createElement(PaypalButton, { isExpress: true, onRegisterPaypal: this.props.analyticsPaypalClicked, href: paypalUri, intl: intl, paypalError: false, hasDescription: false }),
                    React.createElement(VisaCheckoutButton, Object.assign({}, this.props, { onRegisterVisa: this.props.analyticsVisaClicked, checkoutUri: formattedCheckoutUrl })),
                    this.renderMasterpass(formattedCheckoutUrl))));
        };
        this.renderErrors = () => {
            if (location.search && location.search.indexOf("paypalError=true") > -1) {
                return (React.createElement("div", { className: "cart-items" },
                    React.createElement(GlobalWarningMessage, { message: this.props.intl.formatMessage(messages.paypalError) })));
            }
            return;
        };
        this.changePostalCode = (postalCode) => {
            this.props.analyticsPostalCodeUpdated(postalCode);
            if (this.props.changePostalCode) {
                this.props.changePostalCode(postalCode);
            }
        };
        this.isEmpty = () => {
            if (this.props.cart && this.props.cart.shipments) {
                const nonRemovedLineItemsQty = this.props.cart.shipments.reduce((acc, shipment) => [...acc, ...shipment.lineItems], []).filter((lineItem) => lineItem.removed !== true).length;
                return nonRemovedLineItemsQty < 1;
            }
            return true;
        };
        this.isAllNonPurchasable = () => {
            if (!this.props.cart.totalQuantity) {
                return true;
            }
            return false;
        };
        this.getCartMessageHeaderAndBody = (basketShippingStatus) => {
            let header;
            let body;
            const currentRegionName = getEnRegionName(this.props.regionCode);
            if (basketShippingStatus === BasketShippingStatus.EverythingOutOfStockInRegion) {
                header = this.props.intl.formatMessage(messages.everythingOutOfStockInRegion, { region: currentRegionName });
                body = this.props.intl.formatMessage(messages.everythingOutOfStockInRegionBody);
            }
            else if (basketShippingStatus === BasketShippingStatus.EverythingRegionRestricted) {
                header = this.props.intl.formatMessage(messages.everythingRegionRestricted, { region: currentRegionName });
                body = this.props.intl.formatMessage(messages.everythingRegionRestrictedBody);
            }
            else if (basketShippingStatus === BasketShippingStatus.EverythingSoldOutOnline) {
                header = this.props.intl.formatMessage(messages.everythingIsOutOfStock);
                body = this.props.intl.formatMessage(messages.whyNotAddSomething);
            }
            else if (basketShippingStatus === BasketShippingStatus.MixOfNonPurchasable) {
                header = this.props.intl.formatMessage(messages.mixOfNonPurchasable);
                body = this.props.intl.formatMessage(messages.mixOfNonPurchasableBody);
            }
            return { header, body };
        };
        this.renderAllNonPurchasableHeader = () => {
            if (!this.isAllNonPurchasable()) {
                return;
            }
            const { header, body } = this.getCartMessageHeaderAndBody(getShippingStatusSummaryForBasket(this.props.cart));
            return (React.createElement("div", { className: "outof-stock" },
                React.createElement("div", { className: "text" },
                    React.createElement("h2", null, header),
                    React.createElement("p", null, body)),
                React.createElement(Button, { href: "/", className: "continue", appearance: "secondary" },
                    React.createElement("div", { "data-automation": "continue-shopping" }, this.props.intl.formatMessage(messages.continueShopping)))));
        };
        this.renderTotalSummary = (formattedCheckoutUrl) => {
            if (this.isAllNonPurchasable()) {
                return;
            }
            const { cart, intl, } = this.props;
            return (React.createElement("div", { className: "cart-summary" },
                React.createElement("section", { className: "total-summary" },
                    React.createElement("table", null,
                        React.createElement("tbody", null,
                            React.createElement("tr", null,
                                React.createElement("th", null,
                                    intl.formatMessage(messages.estimatedTotal),
                                    ":"),
                                React.createElement("td", null,
                                    React.createElement(ItemCount, { quantity: cart.totalQuantity }),
                                    formatPrice(cart.totalPurchasePrice, intl.locale))))),
                    React.createElement(ContinueToCheckout, Object.assign({}, this.props, { checkoutUri: formattedCheckoutUrl })))));
        };
        this.renderCostSummary = (loading, formattedCheckoutUrl) => {
            if (this.isAllNonPurchasable()) {
                return;
            }
            return (React.createElement(CostSummary, Object.assign({}, this.props.cart, { estimated: true, loading: loading }),
                React.createElement(ContinueToCheckout, Object.assign({}, this.props, { checkoutUri: formattedCheckoutUrl })),
                this.renderAdditionalCheckoutMethods(formattedCheckoutUrl)));
        };
        this.getCartErrorMessage = () => {
            const { intl: { formatMessage } } = this.props;
            const translation = messages[this.props.cart.errorType];
            return translation ? formatMessage(translation) : formatMessage(messages.errorFallbackMessage);
        };
        this.state = {
            cart: null,
            pageLoaded: false,
        };
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.props.getBasketPage();
            this.setState({
                pageLoaded: true,
            });
            if (!this.props.isCsr) {
                this.props.analyticsCartLoaded();
            }
        });
    }
    componentWillUnmount() {
        if (this.props.cleanUp) {
            this.props.cleanUp();
        }
    }
    render() {
        const formattedCheckoutUrl = this.formatCheckoutUrl();
        const { cart, isLightweightBasketEnabled, isRpuEnabled, lang, removeItem, removeChildItem, reserveInStore, regionCode, updateItemQuantity, displayEhfRegions, getProductPath, onGoToPath, features, } = this.props;
        const loading = (cart.status === CartStatus.PROCESSING || cart.status === CartStatus.BASKET_PROCESSING);
        const pageLoading = !(this.state && this.state.pageLoaded);
        return (React.createElement(Loader, { loading: pageLoading, loadingDisplay: (React.createElement("div", { className: styles.pageLoader },
                React.createElement(CircularProgress, { className: "spinner" }))) },
            this.isEmpty()
                ? React.createElement(EmptyCart, { cart: cart, lang: lang, onGoToPath: onGoToPath })
                : (React.createElement("section", { className: styles.basketPage },
                    React.createElement("main", null,
                        this.renderErrors(),
                        React.createElement("form", { action: "/", id: "cart", method: "post", name: "basket-form", onSubmit: (e) => e.preventDefault() },
                            this.renderTotalSummary(formattedCheckoutUrl),
                            React.createElement("div", { className: "cart-items" },
                                React.createElement(OrderPromotionItems, { items: cart.orderLevelDiscounts }),
                                React.createElement("section", { className: "shipment-containers" }, cart
                                    && cart.shipments
                                    && cart.shipments.map((shipment) => (React.createElement(Shipment, Object.assign({ key: "sellerId" + shipment.seller.id, loading: loading }, shipment, { removeItem: removeItem, regionCode: regionCode, removeChildItem: removeChildItem, updateItemQuantity: updateItemQuantity, reserveInStore: reserveInStore, availabilities: cart.availabilities, isRpuEnabled: isRpuEnabled, isLightweightBasketEnabled: isLightweightBasketEnabled, displayEhfRegions: displayEhfRegions, getProductPath: getProductPath, onGoToPath: onGoToPath, features: features, errorType: cart.errorType, intl: this.props.intl, goToBenefitsPage: this.props.goToBenefitsPage, goToManufacturersWarrantyPage: this.props.goToManufacturersWarrantyPage, goToRequiredProducts: this.props.goToRequiredProducts, promotionalBadges: this.props.promotionalBadges })))))))),
                    React.createElement("section", { className: "basket-aside" },
                        this.renderAllNonPurchasableHeader(),
                        !this.props.isCsr && this.renderPostalCodeSection(),
                        this.renderCostSummary(loading, formattedCheckoutUrl)))),
            React.createElement(ErrorToaster, { visible: cart.errorType && cart.errorType !== "", close: this.props.dismissCartError, message: this.getCartErrorMessage() })));
    }
}
export default injectIntl(BasketPage);
//# sourceMappingURL=BasketPage.js.map