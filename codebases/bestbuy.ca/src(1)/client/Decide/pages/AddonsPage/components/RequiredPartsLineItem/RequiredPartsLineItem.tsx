import * as React from "react";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {FormattedMessage} from "react-intl";
import {formatPrice} from "@bbyca/ecomm-checkout-components/dist/react/utilities/formatting";

import ProductImage from "components/ProductImage";
import {classname} from "utils/classname";

import * as styles from "./styles.css";
import messages from "./translations/messages";

export interface Props {
    footer?: React.ReactElement;
    name: string;
    offer: {regularPrice: number; salePrice: number};
    thumbnailUrl: string;
}

const RequiredPartsLineItem: React.FC<Props & InjectedIntlProps> = ({thumbnailUrl, intl, name, offer, footer}) => {
    return (
        <div className={styles.requiredPartsLineItemContainer} data-automation="required-part-item">
            <div className={styles.requiredPartsLineItem}>
                <div className={styles.thumbnailSlot} data-automation="required-part-thumbnail">
                    <ProductImage className={styles.productThumbnail} src={thumbnailUrl} />
                </div>
                <div className={styles.productDescription} data-automation="required-part-name">
                    <p className={styles.productName}>{name}</p>
                    <div className={styles.requiredPart}>
                        <FormattedMessage {...messages.requiredPart} />
                    </div>
                </div>
                <div data-automation="required-part-price">
                    {offer && (
                        <div
                            className={
                                offer.salePrice < offer.regularPrice
                                    ? classname([styles.salePrice, styles.price])
                                    : styles.price
                            }>
                            {formatPrice(offer.salePrice, intl.locale)}
                        </div>
                    )}
                </div>
            </div>
            {!!footer && <div className={styles.footer}>{footer}</div>}
        </div>
    );
};

export default injectIntl(RequiredPartsLineItem);
