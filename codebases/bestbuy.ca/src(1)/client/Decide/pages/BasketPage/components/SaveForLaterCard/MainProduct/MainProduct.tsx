import * as React from "react";
import LazyLoad from "react-lazyload";
import {FormattedMessage} from "react-intl";

import Link from "components/Link";
import {MoveToCartButton, MoveToCartButtonProps} from "../MoveToCartButton";
import {RemoveSavedItemButton} from "../RemoveSavedItemButton";
import {Region} from "models";
import ProductImagePlaceholder from "components/SvgIcons/ProductImagePlaceholder";
import {classname, classIf} from "utils/classname";

import {ProductCardPrice} from "../../ProductCard/ProductCardPrice";
import * as styles from "./styles.css";
import {SavedProduct} from "../../../../../providers/ProductListProvider";
import messages from "./translations/messages";

export interface MainProductProps {
    className?: string;
    displayEhfRegions: Region[];
    regionCode: Region;
    product: SavedProduct;
    onMoveToCartButtonClick: MoveToCartButtonProps["onClick"];
    onRemoveSavedItemButtonClick: React.MouseEventHandler;
}

export const MainProduct: React.FC<MainProductProps> = ({
    className = "",
    displayEhfRegions,
    regionCode,
    product,
    onMoveToCartButtonClick,
    onRemoveSavedItemButtonClick,
}) => {
    const generateS4lCtaBlock = (dataAutomationId: string) => {
        return (
            <>
                {!product.isOnline && (
                    <div className={styles.offlineMessageContainer}>
                        <FormattedMessage {...messages.offlineMessage} />
                    </div>
                )}
                <div className={styles.s4lCta} data-automation={dataAutomationId}>
                    {product.isOnline && (
                        <MoveToCartButton onClick={onMoveToCartButtonClick} className={styles.moveToCartButton} />
                    )}
                    <RemoveSavedItemButton
                        sku={product.sku}
                        onClick={onRemoveSavedItemButtonClick}
                        className={styles.removeButton}
                    />
                </div>
            </>
        );
    };

    return (
        <div
            className={classname([
                styles.parentProductContainer,
                className,
                classIf(styles.offline, !product.isOnline),
            ])}
            data-automation={`main-product-${product.sku}`}>
            <div className={styles.productDetails}>
                <div className={styles.imageContainer} data-automation="main-product-image">
                    <Link to="product" params={[product.seoText, product.sku]} disabled={!product.isOnline}>
                        <LazyLoad>
                            <ProductImagePlaceholder src={product.thumbnailUrl} alt={product.name} width="100%" />
                        </LazyLoad>
                    </Link>
                </div>

                <div className={styles.detailsContainer}>
                    <div className={styles.leftContainer}>
                        <Link
                            to="product"
                            params={[product.seoText, product.sku]}
                            className={styles.productName}
                            extraAttrs={{"data-automation": "product-name"}}
                            disabled={!product.isOnline}>
                            {product.name}
                        </Link>
                        {generateS4lCtaBlock("saved-item-buttons-large")}
                    </div>

                    {product.purchasePrice && (
                        <div className={styles.rightContainer}>
                            <ProductCardPrice
                                displayEhfRegions={displayEhfRegions}
                                regionCode={regionCode}
                                ehf={product.ehf}
                                onSale={product.onSale}
                                purchasePrice={product.purchasePrice}
                                regularPrice={product.regularPrice}
                                saleEnd={product.saleEndDate}
                            />
                        </div>
                    )}
                </div>
            </div>
            {generateS4lCtaBlock("saved-item-buttons-small")}
        </div>
    );
};
