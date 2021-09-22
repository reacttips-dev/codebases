import { Loader, LoadingSkeleton } from "@bbyca/bbyca-components";
import * as React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { PaymentType, TaxType } from "../../business-rules/entities";
import { formatPrice } from "../utilities/formatting";
import * as styles from "./styles.css";
import messages from "./translations/messages";
const EstimateTranslations = {
    orderSummary: messages.orderSummary,
    orderTotal: messages.estimatedTotal,
    pickup: messages.pickup,
    shipping: messages.estimatedShipping,
};
const NonEstimateTranslations = {
    orderSummary: messages.orderSummary,
    orderTotal: messages.orderTotal,
    pickup: messages.pickup,
    shipping: messages.shipping,
};
const loadingScreenContent = () => (React.createElement("div", null,
    React.createElement("div", { className: "cost-sum-line-item" },
        React.createElement(LoadingSkeleton.Title, { maxWidth: 235, className: "skeleton-title" }),
        React.createElement(LoadingSkeleton.Price, { className: "skeleton-price" })),
    React.createElement("div", { className: "cost-sum-line-item" },
        React.createElement(LoadingSkeleton.Title, { maxWidth: 235, className: "skeleton-title" }),
        React.createElement(LoadingSkeleton.Price, { className: "skeleton-price" })),
    React.createElement("div", { className: "cost-sum-line-item" },
        React.createElement(LoadingSkeleton.Title, { maxWidth: 235, className: "skeleton-title" }),
        React.createElement(LoadingSkeleton.Price, { className: "skeleton-price" })),
    React.createElement("div", { className: "cost-sum-line-item" },
        React.createElement(LoadingSkeleton.Title, { maxWidth: 235, className: "skeleton-title" }),
        React.createElement(LoadingSkeleton.Price, { className: "skeleton-price" })),
    React.createElement("div", { className: "cost-sum-line-item" },
        React.createElement(LoadingSkeleton.Title, { maxWidth: 235, className: "skeleton-title" }),
        React.createElement(LoadingSkeleton.Price, { className: "skeleton-price" })),
    React.createElement(LoadingSkeleton.Hr, null),
    React.createElement("div", { className: "cost-sum-line-item" },
        React.createElement(LoadingSkeleton.Title, { maxWidth: 235, className: "skeleton-title" }),
        React.createElement(LoadingSkeleton.Price, { className: "skeleton-price" })),
    React.createElement("div", { className: "cost-sum-line-item" },
        React.createElement(LoadingSkeleton.Title, { maxWidth: 235, className: "skeleton-title" }),
        React.createElement(LoadingSkeleton.Price, { className: "skeleton-price" }))));
export class CostSummary extends React.Component {
    constructor(props) {
        super(props);
        this.summaryBody = () => {
            const { intl: { formatMessage, locale }, totalEHF, totalGiftCards, totalProductPrice, totalPurchasePrice, totalSavings, totalShippingPrice, } = this.props;
            return (React.createElement("table", null,
                React.createElement("tbody", null,
                    React.createElement("tr", { "data-automation": "subtotal" },
                        React.createElement("th", null, formatMessage(this.state.translations.subtotal)),
                        React.createElement("td", null, formatPrice(totalProductPrice, locale))),
                    (totalSavings && totalSavings > 0) === true &&
                        React.createElement("tr", { className: "discount", "data-automation": "order-discounts-total" },
                            React.createElement("th", null, formatMessage(this.state.translations.orderDiscounts)),
                            React.createElement("td", null,
                                React.createElement("div", null,
                                    "-",
                                    formatPrice(totalSavings, locale)))),
                    totalShippingPrice !== undefined &&
                        this.renderShippingRow(),
                    (totalEHF && totalEHF > 0) === true &&
                        React.createElement("tr", { "data-automation": "total-ehf" },
                            React.createElement("th", null, formatMessage(this.state.translations.ehf)),
                            React.createElement("td", null, formatPrice(totalEHF, locale))),
                    this.renderTax()),
                totalPurchasePrice !== null &&
                    React.createElement("tfoot", null,
                        React.createElement("tr", { className: "total", "data-automation": "order-total" },
                            React.createElement("th", null, formatMessage(this.state.translations.orderTotal)),
                            React.createElement("td", null, formatPrice(totalPurchasePrice, locale))),
                        totalGiftCards > 0 ? this.renderOrderTotalBreakdown() : null)));
        };
        this.shouldRenderOrderTotalCopy = () => {
            const { orderTotalBreakdown: breakdown, totalGiftCards, totalPurchasePrice, } = this.props;
            if (!breakdown || breakdown.paymentType === "") {
                return false;
            }
            if (breakdown.paymentType === PaymentType.giftCardOnly) {
                return totalGiftCards >= totalPurchasePrice;
            }
            if (breakdown.paymentType === PaymentType.creditDebit) {
                return breakdown.cardType !== "" && breakdown.lastFourDigits !== "";
            }
            if (breakdown.paymentType === PaymentType.paypal) {
                return breakdown.paypal.paypalEmail !== "" && breakdown.paypal.paypalToken !== "";
            }
            return true;
        };
        this.renderShippingRow = () => {
            const { isInStorePickup, } = this.props;
            return isInStorePickup ? this.renderPickUpShippingRow() : this.renderBaseShippingRow();
        };
        this.renderBaseShippingRow = () => {
            const { intl: { formatMessage, locale }, totalShippingPrice, } = this.props;
            return (React.createElement("tr", { "data-automation": "total-shipping" },
                React.createElement("th", null, formatMessage(this.state.translations.shipping)),
                React.createElement("td", null, totalShippingPrice === 0 ?
                    formatMessage(messages.free) :
                    formatPrice(totalShippingPrice, locale))));
        };
        this.renderPickUpShippingRow = () => {
            const { intl: { formatMessage }, } = this.props;
            return (React.createElement("tr", { className: "pickupShippingRow", "data-automation": "total-shipping-pickup" },
                React.createElement("th", null, formatMessage(this.state.translations.pickup)),
                React.createElement("td", null, formatMessage(messages.free))));
        };
        this.renderOrderTotalBreakdown = () => {
            const { intl: { formatMessage, locale }, orderTotalBreakdown, totalGiftCards, totalPurchasePrice, } = this.props;
            const adjustedTotalGiftCards = totalGiftCards >= totalPurchasePrice ? totalPurchasePrice : totalGiftCards;
            const remainingBalance = totalPurchasePrice - adjustedTotalGiftCards;
            const giftCardsTotalRow = (React.createElement("tr", { key: "giftCards", "data-automation": "giftcards-total" },
                React.createElement("th", null, formatMessage(this.state.translations.giftCardsTotal)),
                React.createElement("td", null,
                    "-",
                    formatPrice(adjustedTotalGiftCards, locale))));
            const remainingBalanceThCopy = orderTotalBreakdown && orderTotalBreakdown.paymentType === PaymentType.paypal
                ? messages.paypal
                : messages.creditCard;
            const remainingBalanceRow = (React.createElement("tr", { key: "remainingBal", "data-automation": "remaining-balance" },
                React.createElement("th", null, formatMessage(remainingBalanceThCopy)),
                React.createElement("td", null, formatPrice(remainingBalance, locale))));
            return [
                giftCardsTotalRow,
                (this.shouldRenderOrderTotalCopy() && remainingBalance > 0 ? remainingBalanceRow : null),
            ];
        };
        this.chooseOrderTotalCopy = ({ numOfGiftCards, isInStorePickup, isInReviewPage, orderTotalBreakdown, }) => {
            if (numOfGiftCards && orderTotalBreakdown.paymentType !== PaymentType.giftCardOnly) {
                return isInStorePickup ? messages.multipleChargedPPU : messages.multipleCharged;
            }
            switch (orderTotalBreakdown.paymentType) {
                case PaymentType.creditDebit:
                    if (isInReviewPage) {
                        return isInStorePickup ? messages.ccChargedPPU : messages.ccCharged;
                    }
                    else {
                        return isInStorePickup ? messages.ccChargedPPUEdit : messages.ccChargedEdit;
                    }
                case PaymentType.giftCardOnly:
                    return isInStorePickup ? messages.giftCardsOnlyChargedInStorePickup : messages.giftCardsOnlyCharged;
                case PaymentType.paypal:
                    return isInStorePickup ? messages.paypalChargedPPU : messages.paypalCharged;
                default:
                    return null;
            }
        };
        this.renderTotalSummaryCopy = ({ intl: { formatMessage, locale }, numOfGiftCards = 0, totalGiftCards = 0, totalPurchasePrice, }) => {
            const orderTotalCopy = this.shouldRenderOrderTotalCopy() && this.chooseOrderTotalCopy(this.props);
            if (!orderTotalCopy) {
                return null;
            }
            return (React.createElement("p", { className: "order-total-copy" },
                React.createElement(FormattedMessage, Object.assign({}, orderTotalCopy, { values: {
                        // cardType: <b>{this.props.orderTotalBreakdown.cardType}</b>, // Might use in the future
                        giftCards: React.createElement("b", null, formatMessage(messages.giftCards)),
                        lastFourDigits: React.createElement("b", null, this.props.orderTotalBreakdown.lastFourDigits),
                        numOfGiftCards,
                        paypal: React.createElement("b", null, formatMessage(messages.paypal)),
                        totalPurchasePrice: React.createElement("b", null, formatPrice(totalPurchasePrice - totalGiftCards, locale)),
                    } }))));
        };
        this.renderTax = () => {
            const { intl: { formatMessage, locale }, tax, totalTaxes, } = this.props;
            if (!tax) {
                return (totalTaxes !== undefined ? (React.createElement("tr", { "data-automation": "total-taxes" },
                    React.createElement("th", null, formatMessage(this.state.translations.estimatedTaxes)),
                    React.createElement("td", null, formatPrice(totalTaxes, locale)))) : null);
            }
            return tax.map((item) => {
                const taxTypeCopy = this.getTaxTypeCopy(item.type);
                if (taxTypeCopy) {
                    return (React.createElement("tr", { key: item.type },
                        React.createElement("th", null, formatMessage(taxTypeCopy)),
                        React.createElement("td", null, formatPrice(item.amount, locale))));
                }
            });
        };
        this.getTaxTypeCopy = (taxType) => {
            switch (taxType) {
                case TaxType.GST:
                    return messages.gst;
                case TaxType.PST:
                    return messages.pst;
                case TaxType.HST:
                    return messages.hst;
            }
        };
        this.state = {
            translations: Object.assign(Object.assign(Object.assign({}, messages), (this.props.estimated ? EstimateTranslations : NonEstimateTranslations)), this.props.translationOverrides),
        };
    }
    render() {
        const { intl: { formatMessage }, children, } = this.props;
        return (React.createElement("section", { className: styles["cost-sum-section"] },
            React.createElement("h2", null, formatMessage(this.state.translations.orderSummary)),
            React.createElement("div", { className: "cost-summary" },
                React.createElement(Loader, { loading: this.props.loading, loadingDisplay: loadingScreenContent() },
                    this.summaryBody(),
                    this.renderTotalSummaryCopy(this.props))),
            children));
    }
}
export default injectIntl(CostSummary);
//# sourceMappingURL=CostSummary.js.map