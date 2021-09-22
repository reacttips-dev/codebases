import ProductPricing, {ProductPricingProps} from "components/ProductCost/ProductPricing";
import ProductImage from "components/ProductImage";
import {ImageProps as ProductImageProps} from "../../Image";
import StarRate from "components/StarRate";
import TruncateText from "components/TruncateText";
import {Col, Row} from "@bbyca/ecomm-components";
import * as React from "react";

import * as styles from "./style.css";
import ProductAvailability from "../../ProductAvailability";
import MarketplaceSeller from "../../MarketplaceSeller";
import {ProductItemProps} from "../ProductItem";
import {FormattedMessage} from "react-intl";
import messages from "./translations/messages";
import BadgeWrapper from "components/BadgeWrapper";
import {injectIntl, InjectedIntlProps} from "react-intl";
import {classname, classIf} from "utils/classname";
import {SimpleProduct as Product} from "models";

export interface ProductListItemProps extends ProductItemProps, InjectedIntlProps {
    productImageProps: ProductImageProps;
    productPricingProps: ProductPricingProps;
    showBadge?: boolean;
    product: Product;
    cellphonePlansCategoryId: string;
    disableSeoAttributes?: boolean;
}

export const ProductListItem = (props: ProductListItemProps) => {
    const {productImageProps, productPricingProps, product, cellphonePlansCategoryId, disableSeoAttributes} = props;
    const isCellphonePlansCategory =
        product.categoryIds && !!product.categoryIds.find((id: string) => id === cellphonePlansCategoryId);
    const shouldDisplayActivationMessage = isCellphonePlansCategory && !product.isMarketplace;

    const productListItemItemProps = {
        container: disableSeoAttributes ? {} : {itemType: "http://schema.org/Product"},
        itemName: disableSeoAttributes ? {} : {itemProp: "name"},
        metaData: <meta itemProp="position" content={props.position} />,
    };

    return (
        <div
            className={`${styles.listItem} ${styles.materialOverride} ${props.className ? props.className : ""}`}
            {...productListItemItemProps.container}
            data-automation={product.isSponsored ? "sponsoredProduct" : undefined}>
            {!disableSeoAttributes && productListItemItemProps.metaData}
            <Row className={styles.productItemRow}>
                <Col
                    xs={props.detailsBelow ? 12 : 4}
                    sm={12}
                    className={`${styles.productItemImageContainer} ${
                        props.detailsBelow ? styles.productImgMarginBottom : styles.productImgMarginRight
                    }`}>
                    <ProductImage {...productImageProps} disableSeoAttributes={disableSeoAttributes} />
                </Col>
                <Col xs={props.detailsBelow ? 12 : 8} sm={12} className={styles.productItemTextContainer}>
                    {product.isSponsored && (
                        <span className={styles.sponsoredProductLabel} data-automation="sponsoredProductLabel">
                            <FormattedMessage {...messages.sponsoredProductLabel} />
                        </span>
                    )}
                    <div
                        className={
                            !!props.hideRating
                                ? styles.productItemNameNoRating
                                : classname([
                                      styles.productItemName,
                                      classIf(styles.detailsBelow, !!props.detailsBelow),
                                  ])
                        }
                        {...productListItemItemProps.itemName}
                        data-automation="productItemName">
                        {!!props.productTitleLines ? (
                            <TruncateText maxLines={props.productTitleLines} trimWhitespace={true}>
                                {product.name}
                            </TruncateText>
                        ) : (
                            product.name
                        )}
                    </div>
                    {!props.hideRating && (
                        <div className={styles.ratingContainer}>
                            <StarRate
                                rate={product.customerRating}
                                hideRatingScore={true}
                                count={product.customerRatingCount}
                                disableSeoAttributes={disableSeoAttributes}
                            />
                        </div>
                    )}
                    <BadgeWrapper className={styles.badgeWrp} sku={product.sku} display={props.showBadge} />
                    <ProductPricing {...productPricingProps} disableSeoAttributes priceSize="medium" />
                    {!props.hideAvailability && (
                        <ProductAvailability
                            sku={product.sku}
                            availability={props.availability}
                            regionName={props.regionName}
                            shouldDisplayActivationMessage={shouldDisplayActivationMessage}
                        />
                    )}

                    {!props.hideMarketplace && <MarketplaceSeller isMarketplaceSeller={product.isMarketplace} />}
                </Col>
            </Row>
        </div>
    );
};

export default injectIntl(ProductListItem);
