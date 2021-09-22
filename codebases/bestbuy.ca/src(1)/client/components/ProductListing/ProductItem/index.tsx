import Link, {Props as LinkProps} from "components/Link";
import {ProductPricingProps, hasSavings} from "components/ProductCost/ProductPricing";
import {ImageProps as ProductImageProps} from "../../Image";
import {Availability, SimpleProduct as Product} from "models";
import * as React from "react";
import {IBrowser as ScreenSize} from "redux-responsive";
import {Key, LinkEvent} from "@bbyca/apex-components";
import * as styles from "./style.css";
import {InView} from "react-intersection-observer";
import ProductListItem from "../ProductListItem";
import isPurchasable from "utils/isPurchasable";

export enum thumbnailImageSizes {
    thumb150 = "thumbnailImage150",
    thumb250 = "thumbnailImage250",
    thumb500 = "thumbnailImage500",
}

export interface ProductItemProps {
    geekSquadSubscriptionSKU?: string;
    position: string;
    product: Product;
    availability: Availability;
    screenSize: ScreenSize;
    detailsBelow?: boolean;
    hideRating?: boolean;
    hideAvailability?: boolean;
    hideMarketplace?: boolean;
    disableRipple?: boolean;
    productTitleLines?: number;
    isMobileApp?: boolean;
    event?: LinkEventProps;
    query?: object;
    className?: string;
    noCrawl?: boolean;
    preferredThumbnailSize?: thumbnailImageSizes.thumb150 | thumbnailImageSizes.thumb250 | thumbnailImageSizes.thumb500;
    shouldRenderAnchorLink?: boolean;
    onClick: (sku: string, seoText: string) => void;
    onProductScrollIntoView: (sku: string) => void;
    externalUrl?: string;
    badgeSkipAvailabilityCheck?: boolean;
    cellphonePlansCategoryId: string;
    disableSeoAttributes?: boolean;
}

export const ProductItem: React.FC<ProductItemProps> = (props: ProductItemProps) => {
    if (!props.product) {
        return null;
    }

    const handleClick = (isExternal: boolean) => (event: React.MouseEvent) => {
        if (!isExternal && props.onClick) {
            event.preventDefault();
            props.onClick(props.product.sku, props.product.seoName);
        }
    };

    const getProductImageProps = () => {
        const {preferredThumbnailSize, product, screenSize} = props;

        let productImageProps = {
            alt: product.name,
            className: styles.productItemImage,
            src: screenSize.greaterThan.extraSmall ? product.thumbnailImage250 : product.thumbnailImage150,
            srcSet: screenSize.greaterThan.extraSmall ? product.thumbnailImage500 + " 3x" : "",
        };

        if (productImageProps && product[preferredThumbnailSize]) {
            productImageProps = {
                ...productImageProps,
                src: product[preferredThumbnailSize],
            };
        }

        return productImageProps;
    };

    const productPricingProps: ProductPricingProps = {
        displaySaleEndDate: false,
        displaySavingPosition: "right",
        ehf: props.product.ehf,
        isSubscription: props.product.sku === props.geekSquadSubscriptionSKU,
        priceSize: "medium",
        priceWithEhf: props.product.priceWithEhf,
        priceWithoutEhf: props.product.priceWithoutEhf,
        saleEndDate: props.product.saleEndDate,
        saving: props.product.saving,
    };

    const handleInViewActions = (inView, entry) => {
        if (inView && props.onProductScrollIntoView) {
            props.onProductScrollIntoView(props.product.sku);
        }
    };

    const productListItemImageProps: ProductImageProps = getProductImageProps();

    const relNoFollow = props.noCrawl ? "nofollow" : null;
    const shouldRenderSponsoredProductLink: boolean = props.product.isSponsored && !!props.product.externalUrl;
    const productItemLinkProps: LinkProps = props.isMobileApp
        ? {
              external: true,
              href: new LinkEvent(props.event).toHref(),
              rel: relNoFollow,
          }
        : {
              itemProp: "url",
              onClick: handleClick(shouldRenderSponsoredProductLink),
              params: [props.product.seoName, props.product.sku],
              to: "product" as Key,
              query: props.query || {},
              rel: relNoFollow,
              external: props.shouldRenderAnchorLink || shouldRenderSponsoredProductLink,
              targetSelf: props.shouldRenderAnchorLink || shouldRenderSponsoredProductLink,
              href: props.product.externalUrl || props.externalUrl,
          };

    return (
        <InView as="div" onChange={handleInViewActions} threshold={0.8}>
            <Link {...productItemLinkProps} disableSeoAttributes={props.disableSeoAttributes}>
                <ProductListItem
                    productImageProps={productListItemImageProps}
                    productPricingProps={productPricingProps}
                    showBadge={
                        hasSavings(productPricingProps) &&
                        (!!props.badgeSkipAvailabilityCheck || isPurchasable(props.availability))
                    }
                    {...props}
                    disableSeoAttributes={props.disableSeoAttributes}
                />
            </Link>
        </InView>
    );
};

export default ProductItem;
