import { ChevronRight, Link, Loader, LoadingSkeleton } from "@bbyca/bbyca-components";
import * as React from "react";
import { injectIntl } from "react-intl";
import { RequiredPartsLineItem } from "../../../LineItem";
import Remove from "../../../Remove";
import messages from "./translations/messages";
const RequiredPartsItemLoader = (props) => (React.createElement("div", null,
    React.createElement(LoadingSkeleton.Title, { width: 300 }),
    React.createElement(LoadingSkeleton.Line, null),
    React.createElement(LoadingSkeleton.Line, { width: 180 }),
    props.children &&
        props.children.map((child) => (React.createElement(LoadingSkeleton.ProductTile, { key: child.sku.id })))));
const RequiredPartsItemDetails = ({ intl, goToRequiredProducts, parentSku, }) => (React.createElement(React.Fragment, null,
    React.createElement("p", null, intl.formatMessage(messages.SeeRequiredPartsDescription)),
    React.createElement(Link, { className: "seeRequiredPartsItemLink", href: "javascript: void(0);", targetSelf: true, onClick: () => goToRequiredProducts(parentSku) },
        intl.formatMessage(messages.SeeRequiredPartsLinkText),
        React.createElement("div", { className: "rightChevron", "data-automation": "required-parts-link" },
            React.createElement(ChevronRight, { color: "blue" })))));
export const RequiredPartsItem = (props) => {
    const { children, isLoading, intl, requiredProducts, removeChildItem, } = props;
    if (!isLoading && (!requiredProducts || !requiredProducts.length)) {
        return null;
    }
    const areAllRequiredProductsInCart = children && requiredProducts && children.length === requiredProducts.length;
    return (React.createElement("section", { className: "seeRequiredPartsItem" },
        React.createElement(Loader, { loading: isLoading, loadingDisplay: React.createElement(RequiredPartsItemLoader, Object.assign({}, props)) },
            React.createElement("header", null, intl.formatMessage(messages.SeeRequiredPartsHeader)),
            !areAllRequiredProductsInCart && (React.createElement(RequiredPartsItemDetails, Object.assign({}, props))),
            children &&
                children.map((child, index) => (React.createElement(React.Fragment, { key: child.sku.id },
                    React.createElement(RequiredPartsLineItem, { name: child.sku.product.name, thumbnailUrl: child.sku.product.thumbnailUrl, offer: {
                            regularPrice: child.sku.offer.regularPrice,
                            salePrice: child.sku.offer.purchasePrice,
                        }, footer: React.createElement(Remove, { className: "remove-required-product", onRemove: () => removeChildItem(child.id) }) }),
                    index < children.length - 1 ? React.createElement("hr", null) : null))))));
};
export default injectIntl(RequiredPartsItem);
//# sourceMappingURL=RequiredPartsItem.js.map