var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GlobalInfoMessage, Loader, LoadingSkeleton } from "@bbyca/bbyca-components";
import CircularProgress from "@material-ui/core/CircularProgress";
import * as React from "react";
import { injectIntl } from "react-intl";
import { connect, } from "react-redux";
import * as entities from "../../../../business-rules/entities";
import { CartStatus, LineItemType, ShippingStatus, } from "../../../../business-rules/entities";
import { isCartStatus } from "../../../../redux/cart";
import { cachedFetchSimpleRequiredProducts, getRequiredProducts, isRequiredProductsLoading, } from "../../../../redux/requiredProducts";
import Remove from "../../../Remove";
import { formatPrice, getEnRegionName } from "../../../utilities/formatting";
import { isOneOfCannotCheckoutShippingStatus } from "../../../utilities/shippingStatusHelper";
import QuantityStepper from "../quantityStepper/QuantityStepper";
import BadgeWrapper from "./BadgeWrapper";
import ChildItems from "./ChildItems";
import FreeItems from "./FreeItems";
import Offer from "./Offer";
import RemovedLineItem from "./RemovedLineItem";
import RequiredPartsItem from "./RequiredPartsItem";
import Rpu from "./Rpu";
import ServicePlanItems from "./ServicePlanItems";
import Status from "./Status";
import * as styles from "./styles.css";
import messages from "./translations/messages";
const maxQuantity = 99;
const PromotionItems = ({ itemLevelDiscounts, intl, loading, totalSavings }) => {
    if (!itemLevelDiscounts || itemLevelDiscounts.length < 1) {
        return null;
    }
    return (React.createElement("tbody", null,
        itemLevelDiscounts.map((item) => (React.createElement("tr", { key: item.id },
            React.createElement("td", { key: item.id, colSpan: 2 }, item.description)))),
        React.createElement("tr", null,
            React.createElement("td", { className: "promo-total" },
                intl.formatMessage(messages.PromotionalDiscount),
                ":"),
            React.createElement("td", { className: "red right" },
                React.createElement(Loader, { loading: loading, loadingDisplay: React.createElement(LoadingSkeleton.Price, null) },
                    "-",
                    formatPrice(totalSavings, intl.locale))))));
};
export class LineItem extends React.Component {
    constructor(props) {
        super(props);
        this.REMOVE_DELAY = 500;
        this.shouldShowBadge = (availability, totalSaving) => {
            if (!availability || !availability.shipping || !availability.pickup) {
                return false;
            }
            const hasSavings = Number(totalSaving) > 0;
            const shipping = availability.shipping && availability.shipping.purchasable;
            const pickup = availability.pickup && availability.pickup.purchasable;
            return hasSavings && (shipping || pickup);
        };
        this.renderWarningMessage = (shippingStatus) => {
            let titleMsg;
            let detailedMsg;
            const currentRegion = getEnRegionName(this.props.regionCode);
            if (shippingStatus === ShippingStatus.SoldOutOnline) {
                titleMsg = this.props.intl.formatMessage(messages.OutOfStock);
                detailedMsg = this.props.intl.formatMessage(messages.OutOfStockDescription);
            }
            else if (shippingStatus === ShippingStatus.OutofStockInRegion) {
                titleMsg = this.props.intl.formatMessage(messages.OutofStockInRegion, { currentRegion });
                detailedMsg = this.props.intl.formatMessage(messages.OutofStockInRegionDescription);
            }
            else if (shippingStatus === ShippingStatus.RegionRestricted) {
                titleMsg = this.props.intl.formatMessage(messages.RegionRestricted, { currentRegion });
                detailedMsg = this.props.intl.formatMessage(messages.RegionRestrictedDescription);
            }
            if (titleMsg) {
                return (React.createElement(Loader, { loading: this.props.loading, resizeWhenLoading: true }, !this.props.loading && (React.createElement("div", { className: "outOfStock-status" },
                    React.createElement("div", { className: "img-col" }),
                    React.createElement("div", { className: "txt-col" },
                        React.createElement("div", { className: "title" }, titleMsg),
                        React.createElement("div", { className: "message" }, detailedMsg))))));
            }
            return "";
        };
        this.getOrderLimit = () => {
            const max = this.props.sku.offer.orderLimit || maxQuantity;
            if (this.props.children) {
                return this.props.children.reduce((minOrderLimit, i) => (i.sku.offer.orderLimit || maxQuantity) < minOrderLimit ? i.sku.offer.orderLimit : minOrderLimit, max);
            }
            return max;
        };
        this.getProductPath = () => {
            const { getProductPath = () => "#", sku } = this.props;
            return getProductPath(sku.id, "");
        };
        this.onProductClick = (e) => {
            e.preventDefault();
            const { onGoToPath = () => 0 } = this.props;
            onGoToPath(e.currentTarget.href);
        };
        this.handleRemoveChildItemClick = (childItemId) => {
            this.props.removeChildItem(this.props.id, childItemId);
        };
        this.handleRemoveItemClick = (e) => {
            e.preventDefault();
            this.setState({
                deleting: true,
                localUpdate: true,
            });
            setTimeout(() => {
                this.props.removeItem(this.props.id);
            }, this.REMOVE_DELAY);
        };
        this.handleQuantityChange = (quantity) => {
            this.setState({
                localUpdate: true,
            });
            this.props.updateItemQuantity(this.props.id, quantity);
        };
        // TODO: This is a little hacky but it's only temporary until the
        // feature toggles are removed. <26-03-19, joshualim> //
        this.isAppropriateServiceInCartFeatureToggleOn = () => {
            const { features } = this.props;
            const servicePlanType = this.props.availableServicePlans &&
                this.props.availableServicePlans.length &&
                this.props.availableServicePlans[0].servicePlanType;
            if (servicePlanType === entities.ServicePlanType.PRP && features && features.grpInCart) {
                return true;
            }
            if (servicePlanType === entities.ServicePlanType.PSP && features && features.gspInCart) {
                return true;
            }
            return false;
        };
        this.newGspInCart = () => {
            return (React.createElement("div", null,
                React.createElement(ServicePlanItems, { parentLineItemId: this.props.id, goToBenefitsPage: this.props.goToBenefitsPage, goToManufacturersWarrantyPage: this.props.goToManufacturersWarrantyPage, features: this.props.features }),
                React.createElement(FreeItems, { items: this.props.children, onRemove: this.handleRemoveChildItemClick })));
        };
        this.childItems = () => {
            return (React.createElement("div", { className: "x-old-gsp-container" },
                React.createElement(ChildItems, { items: this.props.children, onRemove: this.handleRemoveChildItemClick })));
        };
        this.onReserveInStoreButtonClick = () => __awaiter(this, void 0, void 0, function* () {
            const { availabilities, quantity, reserveInStore, sku, } = this.props;
            const isPurchasable = availabilities && availabilities[sku.id].pickup.purchasable;
            if (isPurchasable) {
                yield reserveInStore({ seoText: sku.product.seoText, items: [{ sku: sku.id, quantity }] });
            }
        });
        this.state = {
            deleting: false,
            localUpdate: false,
        };
    }
    componentDidMount() {
        this.props.fetchRequiredProducts(this.props.sku.id);
    }
    componentWillReceiveProps(newProps) {
        if (newProps.loading === false && this.state.localUpdate) {
            this.setState({
                deleting: false,
                localUpdate: false,
            });
        }
    }
    render() {
        const { availabilities, displayEhfRegions, errorType, intl, isLightweightBasketEnabled, isRpuEnabled, purchasable, quantity, regionCode, removed, sku, totalPurchasePrice, totalSavings, promotionalBadges, } = this.props;
        const { deleting } = this.state;
        if (removed) {
            return (React.createElement(RemovedLineItem, Object.assign({}, this.props)));
        }
        const orderLimit = this.getOrderLimit();
        const availability = availabilities && availabilities[sku.id];
        const loading = this.state.localUpdate && this.props.loading;
        const thumbnailUrl = sku.product.thumbnailUrl.includes("/images/common/pictures/noimage") ?
            "https://multimedia.bbycastatic.ca/images/common/pictures/noimage150x150.jpg" : sku.product.thumbnailUrl;
        return (React.createElement("div", { className: styles.lineItemContainer },
            React.createElement("div", { className: "lineItem" },
                isOneOfCannotCheckoutShippingStatus(this.props.shippingStatus) ?
                    this.renderWarningMessage(this.props.shippingStatus) : "",
                React.createElement("header", { className: "product-name" },
                    React.createElement("a", { href: this.getProductPath(), onClick: this.onProductClick }, sku.product.name)),
                React.createElement(Loader, { loading: deleting, loadingDisplay: React.createElement("div", { className: "loading-spinner" },
                        React.createElement(CircularProgress, { className: "spinner", size: 24 })) },
                    React.createElement("div", { className: "container" },
                        isOneOfCannotCheckoutShippingStatus(this.props.shippingStatus) ? "" :
                            React.createElement(Status, Object.assign({}, this.props)),
                        React.createElement("div", { className: `purchasable ${purchasable ? "" : "unavailable"}` }),
                        React.createElement("section", { className: "product-info" },
                            React.createElement("div", { className: "detail" },
                                React.createElement("div", { className: "thumbnail" },
                                    React.createElement("a", { href: this.getProductPath(), onClick: this.onProductClick },
                                        React.createElement("img", { src: thumbnailUrl }))),
                                React.createElement("div", { className: "price" },
                                    React.createElement(BadgeWrapper, { className: styles.badgeWrp, sku: sku.id, locale: intl.locale, promotionalBadges: promotionalBadges, display: this.shouldShowBadge(availability, totalSavings) }),
                                    React.createElement(Offer, { intl: intl, value: sku.offer, regionCode: regionCode, displayEhfRegions: displayEhfRegions }),
                                    isOneOfCannotCheckoutShippingStatus(this.props.shippingStatus) ? "" :
                                        React.createElement("div", { className: "quantity" },
                                            React.createElement(QuantityStepper, { hasQuantityUpdateError: errorType &&
                                                    errorType === "errorUpdateQuantity", quantity: quantity, onChange: this.handleQuantityChange, max: orderLimit })))),
                            React.createElement("div", null,
                                React.createElement(Remove, { onRemove: this.handleRemoveItemClick })),
                            orderLimit && orderLimit === this.props.quantity && orderLimit !== maxQuantity &&
                                React.createElement("div", { className: "house-limit" },
                                    React.createElement(GlobalInfoMessage, { message: intl.formatMessage(messages.OrderLimit, { orderLimit }) })),
                            React.createElement("hr", null),
                            React.createElement("div", { className: "subtotal" },
                                React.createElement("table", null,
                                    React.createElement(PromotionItems, Object.assign({}, this.props, { loading: loading })),
                                    React.createElement("tbody", null,
                                        React.createElement("tr", null,
                                            React.createElement("td", null,
                                                React.createElement("strong", null, intl.formatMessage(messages.ItemSubtotal))),
                                            React.createElement("td", { className: "right" },
                                                React.createElement("strong", null,
                                                    React.createElement(Loader, { loading: loading, loadingDisplay: React.createElement(LoadingSkeleton.Price, null) }, formatPrice(totalPurchasePrice, intl.locale))))))))),
                        React.createElement(Rpu, { availability: availability, isLightweightBasketEnabled: isLightweightBasketEnabled, isRpuEnabled: isRpuEnabled, onReserveInStoreButtonClick: this.onReserveInStoreButtonClick, intl: intl }),
                        React.createElement(RequiredPartsItem
                        // TODO: Fix typing error
                        // @ts-ignore
                        , { 
                            // TODO: Fix typing error
                            // @ts-ignore
                            children: this.props.children && this.props.children.filter(({ lineItemType }) => {
                                return lineItemType === LineItemType.RequiredPart;
                            }), goToRequiredProducts: this.props.goToRequiredProducts, intl: intl, isLoading: this.props.isRequiredProductsLoading, parentSku: sku.id, removeChildItem: this.handleRemoveChildItemClick, requiredProducts: this.props.requiredProducts }),
                        this.isAppropriateServiceInCartFeatureToggleOn() ? this.newGspInCart() : this.childItems())))));
    }
}
const mapStateToProps = (state, props) => ({
    isRequiredProductsLoading: isRequiredProductsLoading(state.requiredProducts, props.sku.id) ||
        isCartStatus(state.cart, CartStatus.PROCESSING),
    requiredProducts: getRequiredProducts(state.requiredProducts, props.sku.id),
});
const mapDispatchToProps = (dispatch) => ({
    fetchRequiredProducts: (sku) => dispatch(cachedFetchSimpleRequiredProducts(sku)),
});
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(LineItem));
//# sourceMappingURL=LineItem.js.map