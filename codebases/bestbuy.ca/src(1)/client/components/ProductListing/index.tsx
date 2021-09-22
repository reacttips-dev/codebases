import {Col, Row} from "@bbyca/ecomm-components";
import List from "@material-ui/core/List";
import * as React from "react";
import {IBrowser as ScreenSize} from "redux-responsive";
import {Availabilities, SimpleProduct as Product, DynamicContentModel, SectionData} from "../../models";
import ProductItem from "./ProductItem";
import * as styles from "./style.css";
import State from "store";
import {connect} from "react-redux";
import DynamicContent from "components/DynamicContent";

interface ProductListProp {
    products: Product[];
    regionName: string;
    availabilities: Availabilities;
    geekSquadSubscriptionSKU: string;
    screenSize: ScreenSize;
    onProductItemClick: (sku: string, seoText: string) => void;
    onProductItemScrollIntoView?: (sku: string) => void;
    rpuToggleFilter?: boolean;
}

interface ProductListStateProps {
    cellphonePlansCategoryId: string;
    dynamicContent: DynamicContentModel;
    language: Language;
}

const searchMerchString:string = "product-listing-position-1";

export const ProductListing = (props: ProductListProp & ProductListStateProps) => {
    if (props.products.length === 0) {
        return null;
    }

    const products: Product[] = addBannerProduct(props.dynamicContent, props.products, props.screenSize);

    const productItems = [];

    products.forEach((product, index) => {
        productItems.push(
            <Col xs={12} sm={4} lg={3} className={`x-productListItem ${styles.productLine}`} key={index}>
                {product.isDynamicContent ? (
                    <DynamicContent
                        isLoading={false}
                        sectionList={[createContextData(props.dynamicContent) as SectionData]}
                        language={props.language}
                        screenSize={props.screenSize}
                        regionName={props.regionName}
                        hasNavigation={false}
                        className={styles.dynamicContent}
                    />
                ) : (
                    <ProductItem
                        geekSquadSubscriptionSKU={props.geekSquadSubscriptionSKU}
                        key={product.sku}
                        position={index.toString()}
                        product={product}
                        availability={props.availabilities[product.sku]}
                        regionName={props.regionName}
                        screenSize={props.screenSize}
                        onClick={props.onProductItemClick}
                        onProductScrollIntoView={product.isSponsored && props.onProductItemScrollIntoView}
                        externalUrl={product.isSponsored && product.externalUrl}
                        cellphonePlansCategoryId={props.cellphonePlansCategoryId}
                    />
                )}
            </Col>,
        );
    });

    return (
        <div itemScope itemType="http://schema.org/ItemList" className={styles.productList}>
            <List
                className={styles.materialOverride}
                classes={{
                    root: styles.list,
                }}>
                <Row className={styles.productsRow}>{productItems}</Row>
            </List>
        </div>
    );
};

const addBannerProduct: Product[] = (
    dynamicContent: DynamicContentModel,
    products: Product[],
    screenSize: ScreenSize,
) => {
    if (dynamicContent?.contexts?.[searchMerchString]?.items?.length > 0 && screenSize) {
        const updatedProducts = products.slice();
        const bannerItem: Product = {...updatedProducts[0]};
        bannerItem.isDynamicContent = true;
        let bannerPosition = updatedProducts.length;

        //Adding dynamic content based on screen size.
        //Mobile - 5th position
        //Tablet and Desktop - 2nd row, last position
        if (screenSize.greaterThan.medium) {
            bannerPosition = updatedProducts.length > 6 ? 7 : updatedProducts.length;
        } else if (screenSize.is.medium || screenSize.is.small) {
            bannerPosition = updatedProducts.length > 4 ? 5 : updatedProducts.length;
        } else if (screenSize.lessThan.small) {
            bannerPosition = updatedProducts.length > 3 ? 4 : updatedProducts.length;
        }
        updatedProducts.splice(bannerPosition, 0, bannerItem);
        return updatedProducts;
    }
    return products;
};

const createContextData = (dynamicContent: DynamicContentModel) => {
    return {
        id: dynamicContent.id,
        items: dynamicContent?.contexts[searchMerchString]?.items,
    };
};

const mapStateToProps = (state: State) => ({
    cellphonePlansCategoryId: state.config.cellphonePlansCategoryId,
});

(ProductListing as React.SFC).displayName = "ProductListing";

export default connect(mapStateToProps)(ProductListing);
