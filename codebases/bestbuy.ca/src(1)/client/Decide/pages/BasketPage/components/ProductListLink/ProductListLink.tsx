import React from "react";
import {FormattedMessage} from "react-intl";

import {utils as adobeLaunch} from "@bbyca/adobe-launch";

import * as styles from "./styles.css";
import messages from "./translations/messages";

export interface ProductListLinkProps {
    total: number;
    productListRef?: React.RefObject<HTMLElement>;
}

export const ProductListLink: React.FC<ProductListLinkProps> = ({total, productListRef = null}) => {
    const onScrollIntoView = (event: React.MouseEvent) => {
        event.preventDefault();
        productListRef?.current?.scrollIntoView({behavior: "smooth"});

        adobeLaunch.pushEventToDataLayer({event: "save-for-later-anchor-link-clicked"});
    };

    if (productListRef && total > 0) {
        return (
            <p className={styles.productListLink} data-automation="product-list-link">
                <FormattedMessage {...messages.youAlsoHave} />
                &nbsp;
                <a href="#void" onClick={onScrollIntoView}>
                    <FormattedMessage {...messages.items} values={{total}} />
                </a>
                .
            </p>
        );
    }

    return <></>;
};
