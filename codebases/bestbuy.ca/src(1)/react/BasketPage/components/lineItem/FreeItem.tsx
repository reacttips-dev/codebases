import * as React from "react";
import { FormattedMessage } from "react-intl";
import Remove from "../../../Remove";
import { formatPrice } from "../../../utilities/formatting";
import messages from "./translations/messages";
const img = (childItem) => React.createElement("img", { width: "32px", height: "32px", src: childItem.sku.product.thumbnailUrl });
const offer = (locale, childItem) => React.createElement("div", { className: "offer" },
    React.createElement("s", null, formatPrice(childItem.totalPrice, locale)),
    " ",
    React.createElement("span", { className: "red" }, formatPrice(childItem.totalPurchasePrice, locale)));
const FreeItem = ({ intl, item, onRemove }) => {
    const onRemoveClick = (e) => {
        e.preventDefault();
        if (onRemove) {
            onRemove(item.id);
        }
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
export default FreeItem;
//# sourceMappingURL=FreeItem.js.map