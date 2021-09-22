import * as React from "react";
import {classname} from "utils/classname";
import LazyLoad from "react-lazyload";
import {FormattedMessage} from "react-intl";

import ProductImagePlaceholder from "components/SvgIcons/ProductImagePlaceholder";
import Link from "components/Link";
import {Region, Product, CartLineItemAvailability} from "models";
import BadgeWrapper from "components/BadgeWrapper";
import FeatureToggle from "components/FeatureToggle";
import {FEATURE_TOGGLES} from "config/featureToggles";
import {Trash} from "@bbyca/bbyca-components";
import {getEnRegionName} from "@bbyca/ecomm-checkout-components";

import {LinkButton} from "../../LinkButton";
import messages from "./translations/messages";
import {ProductCardPrice} from "../../ProductCard/ProductCardPrice";
import QuantityStepper, {QuantityStepperProps} from "./QuantityStepper";
import {SaveForLaterButton} from "../../SaveForLaterButton";
import * as styles from "./styles.css";
import ProductAvailability from "components/ProductAvailability";
import isPurchasable from "utils/isPurchasable";
import MarketplaceSeller from "components/MarketplaceSeller";
import {BBYCA} from "Decide/pages/BasketPage/constants/constants";

export interface ParentProductProps {
    className?: string;
    product: Product;
    displayEhfRegions: Region[];
    regionCode: Region;
    onParentItemRemove: React.MouseEventHandler;
    quantity: QuantityStepperProps;
    onSaveItemForLater: React.MouseEventHandler;
    availability: CartLineItemAvailability;
}

export const ParentProduct: React.FC<ParentProductProps> = ({
    className = "",
    product,
    displayEhfRegions,
    regionCode,
    onParentItemRemove,
    quantity,
    onSaveItemForLater,
    availability,
}) => {
    const ctaBlock = (
        <div className={styles.ctaContainer} data-automation="cta-container">
            <div className={styles.removeContainer}>
                <div className={styles.actionButtons}>
                    <LinkButton
                        automationId="remove-button"
                        text={<FormattedMessage {...messages.removeItem} />}
                        icon={<Trash className={styles.trashIcon} color="blue" />}
                        onClick={onParentItemRemove}
                    />
                    <FeatureToggle
                        featureComponent={<SaveForLaterButton onClick={onSaveItemForLater} />}
                        defaultComponent={null}
                        flag={FEATURE_TOGGLES.saveForLater}
                    />
                </div>
                <div className={styles.quantityStepperContainer}>
                    <QuantityStepper
                        max={quantity.max}
                        onChange={quantity.onChange}
                        quantity={quantity.quantity}
                        disableButtons={quantity.disableButtons}
                        hasQuantityUpdateError={quantity.hasQuantityUpdateError}
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div
            className={classname([styles.parentProductContainer, className])}
            data-automation={`parent-product-${product.sku}`}>
            <div className={styles.productDetails}>
                <div className={styles.imageContainer}>
                    <Link to="product" params={[product.seoText, product.sku]} className={styles.name}>
                        <LazyLoad>
                            <ProductImagePlaceholder src={product.thumbnailUrl} alt={product.name} width="100%" />
                        </LazyLoad>
                    </Link>
                </div>
                <div className={styles.detailsContainer}>
                    <div className={styles.leftContainer} data-automation="left-container">
                        <Link
                            to="product"
                            params={[product.seoText, product.sku]}
                            className={styles.name}
                            extraAttrs={{"data-automation": "product-name"}}>
                            {product.name}
                        </Link>
                    </div>
                    <div className={styles.rightContainer} data-automation="right-container">
                        <BadgeWrapper
                            className={styles.badgeWrp}
                            sku={product.sku}
                            display={product.offer.onSale && isPurchasable(availability)}
                        />
                        <ProductCardPrice
                            displayEhfRegions={displayEhfRegions}
                            regionCode={regionCode}
                            ehf={product.offer.ehf}
                            onSale={product.offer.onSale}
                            purchasePrice={product.offer.purchasePrice}
                            regularPrice={product.offer.regularPrice}
                            saleEnd={product.offer.saleEnd}
                        />
                    </div>
                    <div>
                        <div>
                            <ProductAvailability
                                sku={product.sku}
                                availability={availability}
                                regionName={getEnRegionName(regionCode)}
                                shouldDisplayActivationMessage={false}
                                className={styles.lineItemAvailability}
                            />
                            <MarketplaceSeller isMarketplaceSeller={product.offer.seller?.id !== BBYCA} />
                        </div>
                        {ctaBlock}
                    </div>
                </div>
            </div>
            {ctaBlock}
        </div>
    );
};
