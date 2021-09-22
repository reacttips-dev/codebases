import { GlobalSuccessMessage } from "@bbyca/bbyca-components";
import * as React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { LineItemType } from "../../../../business-rules/entities";
import * as styles from "./styles.css";
import messages from "./translations/messages";
export class RemovedLineItem extends React.Component {
    constructor() {
        super(...arguments);
        this.renderRemoveMessageForChildItems = (childItems) => {
            if (childItems) {
                return childItems
                    .filter((childItem) => this.isDisplayRemoveMessage(childItem))
                    .map((childItem) => {
                    return (React.createElement("div", { key: childItem.id, "data-automation": "child-item-removed-msg", className: "child-item-remove-msg" }, this.renderRemoveMessage(childItem)));
                });
            }
        };
        this.isDisplayRemoveMessage = (childItem) => {
            return childItem.lineItemType === LineItemType.Psp || childItem.lineItemType === LineItemType.FreeItem;
        };
        this.renderRemoveMessage = (childItem) => {
            if (childItem.lineItemType === LineItemType.Psp) {
                return (React.createElement(FormattedMessage, Object.assign({}, messages.gspItemRemovedMsg)));
            }
            if (childItem.lineItemType === LineItemType.FreeItem) {
                return (React.createElement(FormattedMessage, Object.assign({}, messages.freeItemRemovedMsg)));
            }
        };
    }
    render() {
        const { sku, children } = this.props;
        return (React.createElement("div", { className: styles.lineItem },
            React.createElement(GlobalSuccessMessage, null,
                React.createElement(FormattedMessage, Object.assign({}, messages.ItemRemoved, { values: { skuName: sku.product.name } })),
                children && this.renderRemoveMessageForChildItems(children))));
    }
}
export default injectIntl(RemovedLineItem);
//# sourceMappingURL=RemovedLineItem.js.map