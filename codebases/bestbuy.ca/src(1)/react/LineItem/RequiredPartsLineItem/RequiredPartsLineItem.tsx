import * as React from "react";
import { injectIntl } from "react-intl";
import { FormattedMessage } from "react-intl";
import { formatPrice } from "../../utilities/formatting";
import ProductImage from "../ProductImage";
import * as styles from "./styles.css";
import messages from "./translations/messages";
const RequiredPartsLineItem = ({ thumbnailUrl, intl, name, offer, footer, }) => {
    const saleStyle = [`${styles.salePrice} ${styles.price}`];
    return (React.createElement("div", { className: styles.requiredPartsLineItemContainer, "data-automation": "required-part-item" },
        React.createElement("div", { className: styles.requiredPartsLineItem },
            React.createElement("div", { className: styles.thumbnailSlot, "data-automation": "required-part-thumbnail" },
                React.createElement(ProductImage, { className: styles.productThumbnail, src: thumbnailUrl })),
            React.createElement("div", { className: styles.productDescription, "data-automation": "required-part-name" },
                React.createElement("p", { className: styles.productName }, name),
                React.createElement("div", { className: styles.requiredPart },
                    React.createElement(FormattedMessage, Object.assign({}, messages.requiredPart)))),
            React.createElement("div", { "data-automation": "required-part-price" }, offer && React.createElement("div", { className: offer.salePrice < offer.regularPrice ? saleStyle : styles.price }, formatPrice(offer.salePrice, intl.locale)))),
        !!footer && React.createElement("div", { className: styles.footer }, footer)));
};
export default injectIntl(RequiredPartsLineItem);
//# sourceMappingURL=RequiredPartsLineItem.js.map