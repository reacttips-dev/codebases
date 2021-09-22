import * as React from "react";
import * as styles from "./styles.css";
import { Col, Grid, Link, Loader, Row, } from "@bbyca/bbyca-components";
import { noop } from "../../utilities/helpers";
import ProductImage from "../ProductImage";
/**
 * Generic component to show product as a line item. Shows product image on left and generic
 * content provided as children for the rest of space.
 */
export default class ProductLineItem extends React.Component {
    render() {
        const { children, isLoading, loadingDisplay, productImageUrl, productUrl, onClick = noop, } = this.props;
        return React.createElement("div", { className: styles.productLineItem },
            React.createElement(Loader, { loading: isLoading, loadingDisplay: loadingDisplay },
                React.createElement(Grid, null,
                    React.createElement(Row, { middle: "xs" },
                        React.createElement(Col, { xs: true, className: styles.productImageCol, "data-automation": "parent-product-image" }, productUrl ?
                            (React.createElement(Link, { href: productUrl, targetSelf: true, onClick: onClick },
                                React.createElement(ProductImage, { className: styles.productImage, src: productImageUrl })))
                            :
                                (React.createElement(ProductImage, { className: styles.productImage, src: productImageUrl }))),
                        children))));
    }
}
//# sourceMappingURL=ProductLineItem.js.map