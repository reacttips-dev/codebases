import { GeekSquad } from "@bbyca/bbyca-components";
import * as React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { LineItemType } from "../../../../business-rules/entities";
import Remove from "../../../Remove";
import { formatPrice } from "../../../utilities/formatting";
import messages from "./translations/messages";
const img = (childItem) => {
    switch (childItem.lineItemType) {
        case LineItemType.Psp:
            return React.createElement(GeekSquad, { className: "geek-squad-icon" });
        default:
            return React.createElement("img", { width: "32px", height: "32px", src: childItem.sku.product.thumbnailUrl });
    }
};
const offer = (locale, childItem) => {
    let price;
    switch (childItem.lineItemType) {
        case LineItemType.Psp:
            price = React.createElement("span", null, formatPrice(childItem.totalPrice, locale));
            break;
        default:
            price = React.createElement("div", null,
                React.createElement("s", null, formatPrice(childItem.totalPrice, locale)),
                " ",
                React.createElement("span", { className: "red" }, formatPrice(childItem.totalPurchasePrice, locale)));
            break;
    }
    return React.createElement("div", { className: "offer" }, price);
};
export const ChildItem = ({ intl, item, onRemove }) => {
    const onRemoveClick = (e) => {
        e.preventDefault();
        onRemove(item.id);
    };
    return (React.createElement("div", { className: "child-item" },
        React.createElement("header", null,
            React.createElement(FormattedMessage, Object.assign({}, messages[item.lineItemType + "Header"]))),
        React.createElement("div", { className: "product-info" },
            React.createElement("div", { className: "thumbnail" }, img(item)),
            React.createElement("div", { className: "details" },
                React.createElement("div", { className: "product-name" }, item.sku.product.name),
                React.createElement("div", { className: "quantity" },
                    React.createElement(FormattedMessage, Object.assign({}, messages.Quantity, { values: { quantity: item.quantity } })))),
            React.createElement("div", { className: "detail" },
                React.createElement("div", { className: "price" }, offer(intl.locale, item)))),
        React.createElement("footer", null,
            React.createElement(Remove, { onRemove: onRemoveClick }))));
};
const displayableChildItems = [LineItemType.Psp, LineItemType.FreeItem];
const ChildItems = ({ intl, items, onRemove }) => {
    if (!items || items.length < 1) {
        return null;
    }
    const sortedItems = [...items].sort((a, b) => {
        if (a.lineItemType === LineItemType.Psp) {
            return -1;
        }
        if (b.lineItemType === LineItemType.Psp) {
            return 1;
        }
        return 0;
    });
    return (React.createElement("section", { className: "child-items" }, sortedItems.map((item) => {
        if (displayableChildItems.indexOf(item.lineItemType) < 0) {
            return null;
        }
        if (item.lineItemType !== LineItemType.Psp && !item.purchasable) {
            return null;
        }
        return (React.createElement(ChildItem, { intl: intl, item: item, key: item.sku.id, onRemove: onRemove }));
    })));
};
export default injectIntl(ChildItems);
//# sourceMappingURL=ChildItems.js.map