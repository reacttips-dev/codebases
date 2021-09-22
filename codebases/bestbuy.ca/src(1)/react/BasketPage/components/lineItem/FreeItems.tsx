import * as React from "react";
import { injectIntl } from "react-intl";
import { LineItemType } from "../../../../business-rules/entities";
import FreeItem from "./FreeItem";
const displayableChildItems = [LineItemType.FreeItem];
const FreeItems = ({ intl, items, onRemove }) => {
    if (!items || items.length < 1) {
        return null;
    }
    return (React.createElement("section", { className: "child-items" }, items.map((item) => {
        if (displayableChildItems.indexOf(item.lineItemType) < 0) {
            return null;
        }
        if (!item.purchasable) {
            return null;
        }
        return (React.createElement(FreeItem, { intl: intl, item: item, key: item.sku.id, onRemove: onRemove }));
    })));
};
export default injectIntl(FreeItems);
//# sourceMappingURL=FreeItems.js.map