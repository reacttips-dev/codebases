import { Col, Link, LoadingSkeleton, Row, } from "@bbyca/bbyca-components";
import * as React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { formatPrice } from "../../utilities/formatting";
import { noop } from "../../utilities/helpers";
import { ProductLineItem } from "../ProductLineItem";
import * as styles from "./styles.css";
import messages from "./translations/messages";
const ProductLineItemLoader = () => (React.createElement("div", { className: styles.loadingScreen },
    React.createElement(LoadingSkeleton.ProductTile, { width: 300 }),
    React.createElement("div", null,
        React.createElement(LoadingSkeleton.Price, null),
        React.createElement(LoadingSkeleton.Price, null))));
export const ProductDetailsLineItem = ({ productImageUrl, name, regularPrice, ehf, salePrice, saleEndDate, hideSaleEndDate, intl: { locale }, isLoading, productUrl, onProductClick = noop, }) => {
    const isNotOnSale = !salePrice || salePrice === regularPrice;
    const isOnSale = !isNotOnSale;
    const hasEhf = ehf || ehf > 0;
    const ehfAmount = hasEhf ? ehf : 0;
    const regularPriceNotOnSaleClassName = isNotOnSale ? styles.regularPriceNotOnSale : "";
    const productPrice = isOnSale ? salePrice : regularPrice;
    return (React.createElement("div", { className: styles["product-details-line-item"] },
        React.createElement(ProductLineItem, { isLoading: isLoading, loadingDisplay: React.createElement(ProductLineItemLoader, null), productImageUrl: productImageUrl, productUrl: productUrl, onClick: onProductClick },
            React.createElement(Col, { xs: true, className: styles.productContentCol, "data-automation": "parent-product-name" }, productUrl ?
                (React.createElement(Link, { href: productUrl, targetSelf: true, onClick: onProductClick }, name)) : name),
            React.createElement(Col, { xs: true, className: styles.productOfferCol },
                React.createElement(Row, { className: styles.productOfferDetailsRow },
                    React.createElement(Col, { "data-automation": "parent-product-sale-price" },
                        React.createElement("span", { className: `${styles.regularPrice} ${regularPriceNotOnSaleClassName}` }, formatPrice(Number(regularPrice) + Number(ehfAmount), locale)),
                        isOnSale &&
                            React.createElement("span", { className: styles.salePrice }, formatPrice(Number(salePrice) + Number(ehfAmount), locale))),
                    hasEhf &&
                        React.createElement(Col, { "data-automation": "parent-product-ehf" },
                            React.createElement("span", { className: styles.productPriceBreakdown }, `${formatPrice(productPrice, locale)}+${formatPrice(ehfAmount, locale)} `),
                            React.createElement("span", { className: styles.ehf },
                                React.createElement(FormattedMessage, Object.assign({}, messages.ehf)))),
                    !hideSaleEndDate && saleEndDate &&
                        React.createElement(Col, { className: styles.saleEndsOn, "data-automation": "parent-product-sale-end-date" },
                            React.createElement(FormattedMessage, Object.assign({}, messages.saleEndsOn)),
                            React.createElement("span", { className: styles.saleEndDate }, saleEndDate)))))));
};
export default injectIntl(ProductDetailsLineItem);
//# sourceMappingURL=ProductDetailsLineItem.js.map