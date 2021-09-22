import * as React from "react";
import {GlobalSuccessMessage} from "@bbyca/bbyca-components";
import {IDiscount} from "@bbyca/ecomm-checkout-components";

import * as style from "./styles.css";

interface Props {
    items: IDiscount[];
}

const OrderPromoItems: React.FC<Props> = ({items}) => {
    if (!items || items.length <= 0) {
        return null;
    }

    return (
        <div className={style.orderPromo} data-automation="order-promo-items">
            <ol>
                {items.map((item) =>
                    item.description && item.description !== "" ? (
                        <GlobalSuccessMessage key={item.id}>{item.description}</GlobalSuccessMessage>
                    ) : null,
                )}
            </ol>
        </div>
    );
};

OrderPromoItems.displayName = "OrderPromoItems";

export default OrderPromoItems;
