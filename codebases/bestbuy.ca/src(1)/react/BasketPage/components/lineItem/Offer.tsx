import * as React from "react";
import { CartPriceFormatter } from "../../../../business-rules/use-cases";
import { formatPrice } from "../../../utilities/formatting";
import messages from "./translations/messages";
const ehfBreakDown = (intl, showEhf, purchasePrice, ehfAmount) => {
    if (showEhf && ehfAmount) {
        return React.createElement("div", { className: "sale-info" },
            formatPrice(purchasePrice, intl.locale),
            " + ",
            formatPrice(ehfAmount, intl.locale),
            "\u00A0",
            intl.formatMessage(messages.EHFLabel));
    }
    return null;
};
export default ({ value, intl, regionCode, displayEhfRegions }) => {
    const cartPriceFormatter = new CartPriceFormatter();
    const showEhf = cartPriceFormatter.needToDisplayEhf(regionCode, displayEhfRegions);
    const regularPriceToDisplay = cartPriceFormatter.getPriceToDisplay(showEhf, value.regularPrice, value.ehfAmount);
    const purchasePriceToDisplay = cartPriceFormatter.getPriceToDisplay(showEhf, value.purchasePrice, value.ehfAmount);
    if (value.onSale) {
        return (React.createElement("div", { className: "offer" },
            React.createElement("s", null, formatPrice(regularPriceToDisplay, intl.locale)),
            " ",
            React.createElement("span", { className: "promo-info" },
                React.createElement("span", { className: "display-price" }, formatPrice(purchasePriceToDisplay, intl.locale)),
                ehfBreakDown(intl, showEhf, value.purchasePrice, value.ehfAmount)),
            value.saleDateTime &&
                React.createElement("div", { className: "sale-info" },
                    intl.formatMessage(messages.SaleEnds),
                    ": ",
                    value.saleDateTime)));
    }
    return (React.createElement("div", { className: "offer" },
        React.createElement("span", { className: "display-price" }, formatPrice(purchasePriceToDisplay, intl.locale)),
        ehfBreakDown(intl, showEhf, value.purchasePrice, value.ehfAmount)));
};
//# sourceMappingURL=Offer.js.map