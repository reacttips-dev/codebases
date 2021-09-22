import * as React from "react";
import {FormattedMessage} from "react-intl";

import {Region} from "models";
import {classname} from "utils/classname";
import {Bookmark, GlobalErrorMessage} from "@bbyca/bbyca-components";
import {HttpRequestError} from "errors";

import * as styles from "./styles.css";
import messages from "./translations/messages";

import {SavedProduct} from "../../../../providers/ProductListProvider";
import {Status} from "../../../../reducers/productListReducer";
import {SaveForLaterCard, SaveForLaterCardProps} from "../SaveForLaterCard";

export interface ProductListProps extends React.ComponentPropsWithRef<"section"> {
    savedItems: SavedProduct[];
    className?: string;
    displayEhfRegions: Region[];
    regionCode: Region;
    onMoveToCartButtonClick: (sku: string) => void;
    onRemoveSavedItemButtonClick: SaveForLaterCardProps["onRemoveSavedItemButtonClick"];
    error: null | Error;
    status: Status;
}

export const ProductList: React.FC<ProductListProps> = React.forwardRef<HTMLElement, ProductListProps>(
    (
        {
            savedItems,
            className,
            displayEhfRegions,
            regionCode,
            onMoveToCartButtonClick,
            onRemoveSavedItemButtonClick,
            error,
            status,
        },
        ref,
    ) => {
        const showError = !!(error && (error as HttpRequestError).statusCode !== 404);

        if (showError) {
            return (
                <div className={classname([className, styles.productListError])}>
                    <GlobalErrorMessage>
                        <FormattedMessage {...messages.fetchError} />
                    </GlobalErrorMessage>
                </div>
            );
        }

        let content = (
            <div className={styles.saveForLaterEmpty}>
                <Bookmark />
                <p>
                    <FormattedMessage {...messages.noSavedItemsMsg} />
                </p>
            </div>
        );

        if (savedItems.length) {
            content = (
                <ul className={styles.saveForLaterList} data-automation="product-list-items">
                    {[...savedItems].reverse().map((product: SavedProduct) => (
                        <li className={styles.savedItem} key={product.sku}>
                            <SaveForLaterCard
                                product={product}
                                displayEhfRegions={displayEhfRegions}
                                regionCode={regionCode}
                                onMoveToCartButtonClick={onMoveToCartButtonClick}
                                onRemoveSavedItemButtonClick={onRemoveSavedItemButtonClick}
                                status={status}
                            />
                        </li>
                    ))}
                </ul>
            );
        }

        const itemCount = savedItems.filter((item) => !item.removed && !item.movedToCart).length;

        return (
            <section className={classname(styles.productList, className)} data-automation="product-list" ref={ref}>
                <div className={styles.wrapper}>
                    <h2 className={styles.header}>
                        <FormattedMessage
                            {...messages.header}
                            values={{
                                items: (
                                    <span className={styles.itemCount}>
                                        <FormattedMessage {...messages.items} values={{itemCount}} />
                                    </span>
                                ),
                            }}
                        />
                    </h2>
                    {content}
                </div>
            </section>
        );
    },
);

export default ProductList;
