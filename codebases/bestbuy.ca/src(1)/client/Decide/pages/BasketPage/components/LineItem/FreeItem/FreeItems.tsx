import * as React from "react";
import {FormattedMessage, InjectedIntlProps, injectIntl} from "react-intl";
import {Remove, formatPrice} from "@bbyca/ecomm-checkout-components";
import {LoadingSkeleton} from "@bbyca/bbyca-components";

import {ChildLineItem} from "models";

import messages from "./translations/messages";
import * as styles from "./styles.css";

interface Item {
    onRemove: (lineItemId: string) => void;
}

export interface FreeItemProps extends Item {
    item: ChildLineItem;
}

export interface FreeItemsProps extends Item {
    items: ChildLineItem[];
}

const FreeItemLoader: React.FC = () => (
    <div>
        <LoadingSkeleton.Title width={300} />
        <LoadingSkeleton.Line width={180} />
        <LoadingSkeleton.ProductTile />
    </div>
);

export const FreeItem = ({intl, item, onRemove}: FreeItemProps & InjectedIntlProps) => {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const onRemoveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsLoading(true);
        onRemove(item.id);
    };

    return (
        <div className={styles.container}>
            {isLoading ? (
                <FreeItemLoader />
            ) : (
                <form>
                    <input type="hidden" name="id" value={item.id} />
                    <header className={styles.freeItemHeader}>
                        <FormattedMessage {...messages.FreeItemHeader} />
                    </header>
                    <div className={styles.freeItemContent}>
                        <img className={styles.thumbnail} alt={item.product.name} src={item.product.thumbnailUrl} />
                        <div className={styles.details}>
                            <div className={styles.productName}>{item.product.name}</div>
                            <div className={styles.quantity}>
                                <FormattedMessage {...messages.Quantity} values={{quantity: item.summary.quantity}} />
                            </div>
                        </div>
                        <div className={styles.details}>
                            <div className={styles.offer}>
                                <p>
                                    <s>{formatPrice(item.summary.subtotal, intl.locale)}</s>{" "}
                                    <span className={styles.discount}>
                                        {formatPrice(item.summary.total, intl.locale)}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <footer>
                        <Remove onRemove={onRemoveClick} type="submit" />
                    </footer>
                </form>
            )}
        </div>
    );
};

const FreeItems: React.FC<FreeItemsProps & InjectedIntlProps> = ({intl, items, onRemove}) => {
    return (
        <div className={styles.freeItems}>
            {items.map((item, index) => {
                return (
                    <React.Fragment key={item.product.sku}>
                        <FreeItem intl={intl} item={item} onRemove={onRemove} />
                        <hr />
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default injectIntl(FreeItems);
