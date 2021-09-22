import { BestBuyLogo, MarketplaceLogo } from "@bbyca/bbyca-components";
import * as React from "react";
import { injectIntl } from "react-intl";
import LineItem from "../lineItem/LineItem";
import * as styles from "./styles.css";
import messages from "./translations/messages";
const isShipmentWithOnlyRemovedItems = (lineItems) => {
    return lineItems.filter((li) => li.removed !== true).length < 1;
};
const Shipment = ({ availabilities, displayEhfRegions, errorType, getProductPath, intl, isLightweightBasketEnabled, lineItems, loading, onGoToPath, regionCode, removeChildItem, removeItem, reserveInStore, seller, updateItemQuantity, features, goToBenefitsPage, goToManufacturersWarrantyPage, goToRequiredProducts, promotionalBadges, }) => {
    if (!lineItems || lineItems.length < 1) {
        return null;
    }
    const isBBY = seller.id === "bbyca";
    return (React.createElement("div", { className: styles.shipment },
        !isShipmentWithOnlyRemovedItems(lineItems) && React.createElement("h3", null,
            React.createElement("span", { className: "sold-by", "data-seller-id": seller.id },
                isBBY ?
                    React.createElement(BestBuyLogo, { className: `sellerlogo bbyNewStyle` }) :
                    React.createElement(MarketplaceLogo, { className: `sellerlogo bbyNewStyle` }),
                intl.formatMessage(messages.soldBy),
                " ",
                seller.name)),
        React.createElement("ul", { className: "line-items" }, lineItems.map((item) => (React.createElement("li", { key: "sku" + item.sku.id },
            React.createElement(LineItem, Object.assign({}, item, { availabilities: availabilities, displayEhfRegions: displayEhfRegions, errorType: errorType, getProductPath: getProductPath, isLightweightBasketEnabled: isLightweightBasketEnabled, loading: loading, onGoToPath: onGoToPath, regionCode: regionCode, removeChildItem: removeChildItem, removeItem: removeItem, reserveInStore: reserveInStore, updateItemQuantity: updateItemQuantity, features: features, goToBenefitsPage: goToBenefitsPage, goToManufacturersWarrantyPage: goToManufacturersWarrantyPage, goToRequiredProducts: goToRequiredProducts, promotionalBadges: promotionalBadges }))))))));
};
export default injectIntl(Shipment);
//# sourceMappingURL=Shipment.js.map