import * as React from "react";
import {FormattedMessage} from "react-intl";
import {IBrowser} from "redux-responsive/types";
import {Col, Row} from "@bbyca/ecomm-components";
import {ErrorState, Region, SimpleProductProps, ThunkResult, RecommendationApiProduct} from "models";
import {classname} from "utils/classname";
import {recommendationDataMapper} from "../../providers/ProductProvider/recommendationDataMapper";
import messages from "./translations/messages";
import * as styles from "./style.css";
import ProductCard from "./ProductCard";

export interface ProductProps extends SimpleProductProps {
    query?: {
        icmp: string;
    };
    location?: string;
}

interface RecommendationsProps {
    errors: ErrorState;
    screenSize: IBrowser;
    regionName: Region;
    TitleComponent: string | React.ComponentType<any | string>;
    onGotoBasketPage: () => void;
    getRecommendationAvailabilities: (skus: string[]) => ThunkResult<void>;
    maximumProductsCount?: number;
    isMobileApp?: boolean;
    noCrawl?: boolean;
    showAddToCartButton?: boolean;
    disableSeoAttributes?: boolean;
    productsLimitOnSmallScreen?: number;
    titleProps?: any;
    containerProps?: any;
    location?: string;
    icmp?: string;
    hideDivider?: boolean;
    title?: React.ReactNode;
}

interface RecommendationsWithProductsProps extends RecommendationsProps {
    products: ProductProps[];
    recommendationProducts?: never;
    locale?: never;
    appLocationRegionCode?: never;
}

interface RecommendationsWithRecommenditionProductsProps extends RecommendationsProps {
    recommendationProducts: RecommendationApiProduct[];
    locale: Locale;
    appLocationRegionCode: Region;
    products?: never;
}

export type BoughtAlsoBoughtProps = RecommendationsWithProductsProps | RecommendationsWithRecommenditionProductsProps;

export type ProductBaseType = (ProductProps | RecommendationApiProduct) & {location?: string};

const BoughtAlsoBought: React.FC<BoughtAlsoBoughtProps> = ({
    getRecommendationAvailabilities,
    onGotoBasketPage,
    products = [],
    recommendationProducts = [],
    errors,
    screenSize,
    regionName,
    isMobileApp,
    noCrawl,
    showAddToCartButton,
    disableSeoAttributes,
    locale,
    appLocationRegionCode,
    titleProps,
    containerProps,
    hideDivider = false,
    title = <FormattedMessage {...messages.youMightAlsoLike} />,
    TitleComponent = "h2",
    productsLimitOnSmallScreen = 2,
    maximumProductsCount = 4,
    location = "PDP BAB",
    icmp = "Recos_4across_y_mght_ls_lk"
}) => {
    const isSmallScreen = screenSize.lessThan.small;
    const [productsList, productSKUs] = React.useMemo(() => {
        const dataSource = products.length > 0 ? products : recommendationProducts;
        let productsSkus: string[] = [];
        let productsData = dataSource.map((product: ProductBaseType) => {
            productsSkus.push(product.sku);
            let productBase: ProductBaseType = product;
            if (!products?.length && locale && appLocationRegionCode) {
                productBase = recommendationDataMapper(
                    productBase as RecommendationApiProduct,
                    locale,
                    appLocationRegionCode,
                );
            }
            productBase = {
                ...productBase,
                query: {
                    icmp,
                },
                location,
            };
            return productBase;
        });
        const count = isSmallScreen && productsLimitOnSmallScreen ? productsLimitOnSmallScreen : maximumProductsCount;
        if (count) {
            productsSkus = productsSkus.slice(0, count);
            productsData = productsData.slice(0, count);
        }
        return [productsData, productsSkus];
    }, [
        products,
        recommendationProducts,
        isSmallScreen,
        productsLimitOnSmallScreen,
        maximumProductsCount,
        icmp,
        location,
    ]);

    // Todo: it seems that features store in redux is not immutable, we have to take a look at it in future.
    React.useEffect(() => {
        if (productSKUs?.length && showAddToCartButton) {
            getRecommendationAvailabilities(productSKUs);
        }
    }, [productSKUs.join(""), showAddToCartButton]);

    return productsList?.length ? (
        <div className={styles.heightContainer}>
            {!hideDivider && <hr className={styles.headerDivider} />}
            <TitleComponent {...titleProps} className={classname([styles.header, titleProps?.className])}>
                {title}
            </TitleComponent>
            <div {...containerProps} className={classname([styles.container, containerProps?.className])}>
                <Row>
                    {productsList.map((product, index) => (
                        <Col xs={6} sm={3} key={product.sku}>
                            <div className={styles.innerColumn}>
                                <ProductCard
                                    product={product as ProductProps}
                                    index={index}
                                    onGotoBasketPage={onGotoBasketPage}
                                    errors={errors}
                                    screenSize={screenSize}
                                    regionName={regionName}
                                    isMobileApp={isMobileApp}
                                    noCrawl={noCrawl}
                                    showAddToCartButton={showAddToCartButton}
                                    disableSeoAttributes={disableSeoAttributes}
                                />
                            </div>
                        </Col>
                    ))}
                </Row>
            </div>
            {!hideDivider && <hr className={styles.footerDivider} />}
        </div>
    ) : (
        <></>
    );
};

export default BoughtAlsoBought;
