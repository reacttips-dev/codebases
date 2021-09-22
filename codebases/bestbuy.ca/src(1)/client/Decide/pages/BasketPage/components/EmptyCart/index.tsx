import * as React from "react";
import {FormattedMessage} from "react-intl";
import {CartEmpty, GlobalSuccessMessage} from "@bbyca/bbyca-components";

import {CartLineItem} from "models";

import * as styles from "./styles.css";
import messages from "./translations/messages";
import RemovedItemMessaging from "../RemovedItemMessaging";
import savedItemMessages from "../LineItem/translations/messages";

export interface EmptyCartProps {
    lineItems?: CartLineItem[];
}

const EmptyCart: React.FC<EmptyCartProps> = ({lineItems}) => (
    <section className={styles.container} data-automation="empty-cart">
        {lineItems &&
            lineItems.map((lineItem, index) =>
                lineItem.savedForLater ? (
                    <div key={`savedItem-${index}`} className={styles.savedItemMessage}>
                        <GlobalSuccessMessage>
                            <FormattedMessage
                                {...savedItemMessages.ItemSaved}
                                values={{skuName: lineItem.product.name}}
                            />
                        </GlobalSuccessMessage>
                    </div>
                ) : (
                    <RemovedItemMessaging
                        key={`removedItem-${index}`}
                        parentName={lineItem.product.name}
                        childLineItems={lineItem.childLineItems}
                    />
                ),
            )}
        <div className={styles.content}>
            <div className={styles.textContainer}>
                <h2>
                    <FormattedMessage {...messages.emptyCartHeader} />
                </h2>
                <p>
                    <FormattedMessage {...messages.emptyCartText} />
                </p>
            </div>
            <CartEmpty className={styles.icon} viewBox="0 0 32 32" />
        </div>
    </section>
);

EmptyCart.displayName = "EmptyCart";

export default EmptyCart;
