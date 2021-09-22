import * as React from "react";
import {LoadingSpinner, Warning} from "@bbyca/bbyca-components";
import {IBrowser} from "redux-responsive/types";
import {AddToCart} from "@bbyca/ecomm-checkout-components/dist/components";
import {FormattedMessage} from "react-intl";

import {ErrorState, Region, SimpleProduct} from "models";
import {classname} from "utils/classname";
import ProductItem from "components/ProductListing/ProductItem";
import AvailabilityIcon from "components/ProductAvailability/components/AvailabilityIcon";

import {ProductProps} from "./";
import messages from "./translations/messages";
import * as styles from "./style.css";

export interface ProductCardProps {
    product: ProductProps;
    index: number;
    screenSize: IBrowser;
    regionName: Region;
    isMobileApp?: boolean;
    noCrawl?: boolean;
    onGotoBasketPage: () => void;
    showAddToCartButton?: boolean;
    errors: ErrorState;
    disableSeoAttributes?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
    product,
    index,
    regionName,
    screenSize,
    isMobileApp,
    noCrawl,
    errors,
    onGotoBasketPage,
    showAddToCartButton,
    disableSeoAttributes,
}) => (
    <div key={index} className={styles.productCardContainer}>
        <div className={styles.productItemContainer}>
            <ProductItem
                className={styles.boughtAlsoBoughtItem}
                position={`${index}`}
                product={new SimpleProduct(product)}
                regionName={regionName}
                screenSize={screenSize}
                availability={null}
                onClick={null}
                detailsBelow={true}
                hideRating={false}
                disableRipple={true}
                productTitleLines={2}
                query={product.query}
                isMobileApp={isMobileApp}
                noCrawl={noCrawl}
                disableSeoAttributes={disableSeoAttributes}
            />
        </div>
        {showAddToCartButton && (
            <div className={styles.buttonContainer}>
                {!product.isAvailabilityLoaded ? (
                    <LoadingSpinner width="24" containerClass={styles.loader} />
                ) : (
                    <AvailabilityBlock product={product} onGotoBasketPage={onGotoBasketPage} errors={errors} />
                )}
            </div>
        )}
    </div>
);

export const AvailabilityBlock: React.FC<{
    product: ProductProps;
    onGotoBasketPage: () => void;
    errors: any;
}> = ({product, onGotoBasketPage, errors}) => {
    const hasErrors = errors && errors.error && errors.error.name === "GetAvailabilitiesError";
    if (hasErrors) {
        return (
            <div className={classname([styles.cardFooterContainer, styles.errorContainer])}>
                <Warning className={classname([styles.iconSize, styles.colorWarning])} />
                <span className={styles.cardFooterMessage}>
                    <FormattedMessage {...messages.error} />
                </span>
            </div>
        );
    }

    if (product.isAvailable || product.isPreOrder) {
        const preOrderLabel = product.isPreOrder && <FormattedMessage {...messages.preOrder} />;
        return (
            <AddToCart
                className={styles.cardFooterContainer}
                buttonClassName={styles.addToCartButton}
                offer={product}
                label={preOrderLabel}
                onViewCart={onGotoBasketPage}
                isCartLoading={false}
                disabled={false}
                showCartIcon={true}
            />
        );
    }
    return (
        <div className={`${styles.cardFooterContainer} ${styles.outOfStockContainer}`}>
            <AvailabilityIcon purchasable={false} className={classname([styles.iconSize, styles.outOfStockIcon])} />
            <span className={styles.cardFooterMessage}>
                <FormattedMessage {...messages.soldOutOnline} />
            </span>
        </div>
    );
};

export default ProductCard;
