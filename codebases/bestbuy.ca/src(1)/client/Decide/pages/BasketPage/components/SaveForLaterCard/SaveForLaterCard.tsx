import * as React from "react";
import {useState, useEffect, useRef, ReactNode} from "react";
import {InjectedIntlProps, injectIntl, FormattedMessage} from "react-intl";

import {GlobalSuccessMessage, GlobalErrorMessage, LoadingSpinner} from "@bbyca/bbyca-components";
import {Region} from "models";
import {classname, classIf} from "utils/classname";

import * as styles from "./styles.css";
import MainProduct from "./MainProduct";
import {SavedProduct} from "../../../../providers/ProductListProvider";
import {Status} from "../../../../reducers/productListReducer";
import messages from "./translations/messages";

export interface SaveForLaterCardProps {
    product: SavedProduct;
    displayEhfRegions: Region[];
    regionCode: Region;
    onMoveToCartButtonClick: (sku: string) => void;
    onRemoveSavedItemButtonClick: (sku: string) => void;
    status: Status;
}

export const SaveForLaterCard: React.FC<SaveForLaterCardProps & InjectedIntlProps> = ({
    product,
    displayEhfRegions,
    regionCode,
    onMoveToCartButtonClick,
    onRemoveSavedItemButtonClick,
    status,
}) => {
    const {sku, name, removed, removeError, movedToCart, moveToCartError} = product;

    const [deleting, setDeleting] = useState(false);
    const successMessage = useRef<ReactNode | null>(null);

    useEffect(() => {
        if (status !== Status.loading) {
            setDeleting(false);
        }
    }, [status]);

    const handleMoveItemClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();

        setDeleting(true);
        onMoveToCartButtonClick(sku);
    };

    const handleRemoveItemClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();

        setDeleting(true);
        onRemoveSavedItemButtonClick(sku);
    };

    let removePrefix = "";
    if (removed) {
        successMessage.current = <FormattedMessage {...messages.itemRemoved} values={{skuName: name}} />;
        removePrefix = "re";
    } else if (movedToCart) {
        successMessage.current = <FormattedMessage {...messages.itemMovedToCart} values={{skuName: name}} />;
    }

    return (
        <div
            className={classname([
                styles.lineItemContainer,
                classIf(styles.removedItem, removed || false),
                classIf(styles.deleteLoading, deleting),
                classIf(styles.removeItemError, removeError || false),
                classIf(styles.moveToCartError, moveToCartError || false),
                classIf(styles.movedToCart, movedToCart || false),
            ])}
            data-sku={sku}
            data-automation={`saved-item-${sku}`}>
            <div className={styles.removedItemMessage}>
                <GlobalSuccessMessage data-automation={`${removePrefix}moved-item-global-success-message`}>
                    {successMessage.current}
                </GlobalSuccessMessage>
            </div>
            <div className={classname([styles.lineItem])}>
                <div className={styles.loadingBlock}>
                    <LoadingSpinner containerClass={styles.loadingIcon} isLight={false} width={"40px"} />
                </div>
                <div className={styles.container}>
                    <section className={styles.lineItemBlock} data-automation="saveforlater-mainproduct">
                        <div className={styles.removeItemErrorMessage}>
                            <GlobalErrorMessage>
                                <FormattedMessage {...messages.itemRemovedError} values={{skuName: name}} />
                            </GlobalErrorMessage>
                        </div>
                        <div className={styles.movedItemToCartErrorMessage}>
                            <GlobalErrorMessage>
                                <FormattedMessage {...messages.movedItemToCartErrorMessage} values={{skuName: name}} />
                            </GlobalErrorMessage>
                        </div>
                        <MainProduct
                            product={product}
                            displayEhfRegions={displayEhfRegions}
                            regionCode={regionCode}
                            onMoveToCartButtonClick={handleMoveItemClick}
                            onRemoveSavedItemButtonClick={handleRemoveItemClick}
                        />
                    </section>
                </div>
            </div>
        </div>
    );
};

export default injectIntl(SaveForLaterCard);
