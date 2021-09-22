import * as React from "react";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {connect} from "react-redux";
import {IBrowser as ScreenSize} from "redux-responsive/types";

import State from "store";
import {Offer, DetailedProduct, CustomerReviews, ProductContent, isBundle, Seller} from "models";
import {FeatureToggles} from "config";

import {Tabs, TabItem} from "../../../../components/Tabs";
import SellerPolicy from "../../../../components/SellerPolicy";
import {Policy} from "../../../../components/Policy";
import messages from "./translations/messages";
import ProductWhatsIncluded from "./components/ProductWhatsIncluded";
import {BundleReturnPolicy, ProductReturnPolicy} from "./components/ReturnPolicy";
import * as styles from "./style.css";
import {BazaarvoiceQuestionsTab} from "./components/BazaarvoiceQuestionsTab";
import {DetailsAndSpecs} from "./components/DetailsAndSpecs";
import {MoreInformation} from "./components/MoreInformation";
import {ReviewsTab} from "./components/ReviewsTab";
import FromTheManufacturer from "./components/FromTheManufacturer";
import {TabStyle} from "Decide/components/Tabs/Tabs";
import {getScreenSize} from "store/selectors";

export enum ProductDetailTabId {
    MoreInfo = "moreInfo",
    DetailsAndSpecs = "detailsAndSpecs",
    Reviews = "reviews",
    ProductReturnPolicy = "productReturnPolicy",
    WhatsIncluded = "whatsIncluded",
    QuestionsAndAnswers = "questionsAndAnswer",
    MarketplaceSellerShippingPolicy = "marketplaceSellerShippingPolicy",
    MarketplaceSellerReturnPolicy = "marketplaceSellerReturnPolicy",
    BundleReturnPolicy = "bundleReturnPolicy",
    FromTheManufacturer = "fromTheManufacturer",
}

interface Props {
    getSupportContent?: JSX.Element | React.Component;
    product: DetailedProduct;
    offer?: Offer;
    customerReviews: CustomerReviews;
    targettedContent?: ProductContent;
    scrollIntoViewTabId?: ProductDetailTabId;
    disableSeoAttributes?: boolean;
}

export interface StateProps {
    screenSize: ScreenSize;
    language: Language;
    features: FeatureToggles;
    seller: Seller;
}

export type ProductDetailTabProps = Props & StateProps & DispatchProps & InjectedIntlProps;

export const ProductDetailTab: React.FC<ProductDetailTabProps> = ({
    customerReviews,
    targettedContent,
    getSupportContent,
    intl,
    offer,
    product,
    scrollIntoViewTabId,
    features,
    disableSeoAttributes,
    language,
    screenSize,
    seller,
}) => {
    const returnPolicy =
        targettedContent &&
        targettedContent.contexts &&
        targettedContent.contexts.return_policy &&
        targettedContent.contexts.return_policy.items &&
        targettedContent.contexts.return_policy.items[0];
    const marketplaceSellerPolicies = product.isMarketplace && seller?.policies;
    const hasDescription = !!product.longDescription;
    const hasConstituentDescription =
        product &&
        isBundle(product) &&
        product.bundleProducts &&
        !product.bundleProducts.every((constituent) => !constituent.shortDescription);
    const hasConstituentSpecs =
        product &&
        product.bundleProducts &&
        !product.bundleProducts.every(
            (constituent) => !(constituent.specs && Object.keys(constituent.specs).length > 0),
        );
    const hasProductSpecs = product.specs && Object.keys(product.specs).length > 0;
    const hasSpecs = hasProductSpecs || hasConstituentSpecs;
    const {bazaarvoiceQuestionsEnabled, pdpFromTheManufacturerTabEnabled} = features;
    let tabStyle: TabStyle;
    if (screenSize && screenSize.is && screenSize.is.extraSmall) {
        tabStyle = TabStyle.vertical;
    } else if (screenSize && screenSize.greaterThan && screenSize.greaterThan.small) {
        tabStyle = TabStyle.horizontal;
    }

    return (
        <div id="productDetailsTab">
            <Tabs scrollIntoViewTabId={scrollIntoViewTabId} tabStyle={tabStyle} className={styles.verticalTabs}>
                <TabItem
                    tabLabel={intl.formatMessage(messages.moreInformation)}
                    className={styles.productInfoContainer}
                    dataAutomation="pdp-more-information-tab"
                    fullWidth={true}
                    id={ProductDetailTabId.MoreInfo}>
                    {(hasDescription || hasConstituentDescription) && (
                        <MoreInformation
                            product={product}
                            screenSize={screenSize}
                            supportContent={getSupportContent || null}
                        />
                    )}
                </TabItem>
                <TabItem
                    tabLabel={intl.formatMessage(messages.specs)}
                    className={styles.productInfoContainer}
                    data-automation="pdp-product-specs-tab"
                    id={ProductDetailTabId.DetailsAndSpecs}>
                    {!!hasSpecs && (
                        <DetailsAndSpecs
                            intl={intl}
                            offer={offer}
                            isBundle={isBundle(product)}
                            isMarketplace={product.isMarketplace}
                            specs={product.specs}
                            bundleProducts={product.bundleProducts}
                            sku={product.sku}
                        />
                    )}
                </TabItem>
                <TabItem
                    tabLabel={intl.formatMessage(messages.whatsIncludedTitle)}
                    id={ProductDetailTabId.WhatsIncluded}
                    className={styles.productInfoContainer}>
                    {product.whatsIncluded && product.whatsIncluded.length > 0 && (
                        <ProductWhatsIncluded boxContents={product.whatsIncluded} sku={product.sku} />
                    )}
                </TabItem>
                {pdpFromTheManufacturerTabEnabled && (
                    <TabItem
                        tabLabel={intl.formatMessage(messages.fromTheManufacturer)}
                        className={styles.productInfoContainer}
                        dataAutomation="pdp-from-the-manufacturer-tab"
                        id={ProductDetailTabId.FromTheManufacturer}>
                        <FromTheManufacturer sku={product.sku} />
                    </TabItem>
                )}
                <TabItem
                    tabLabel={intl.formatMessage(messages.customerReviews)}
                    id={ProductDetailTabId.Reviews}
                    className={styles.productInfoContainer}
                    fullWidth={true}>
                    {customerReviews && (
                        <ReviewsTab
                            customerReviews={customerReviews}
                            product={product}
                            disableSeoAttributes={disableSeoAttributes}
                            language={language}
                        />
                    )}
                </TabItem>
                <TabItem
                    tabLabel={intl.formatMessage(messages.commonQuestionsTitle)}
                    className={styles.productInfoContainer}
                    id={ProductDetailTabId.QuestionsAndAnswers}>
                    {bazaarvoiceQuestionsEnabled && <BazaarvoiceQuestionsTab sku={product.sku} />}
                </TabItem>
                <TabItem
                    tabLabel={intl.formatMessage(messages.bundleReturnPolicyTitle)}
                    id={ProductDetailTabId.BundleReturnPolicy}
                    className={styles.productInfoContainer}>
                    {isBundle(product) && <BundleReturnPolicy sku={product.sku} />}
                </TabItem>
                <TabItem
                    tabLabel={intl.formatMessage(messages.productReturnPolicyTitle)}
                    id={ProductDetailTabId.ProductReturnPolicy}
                    className={styles.productInfoContainer}>
                    {!isBundle(product) && !product.isMarketplace && (
                        <ProductReturnPolicy overwrite={returnPolicy} sku={product.sku} />
                    )}
                </TabItem>
                <TabItem
                    tabLabel={intl.formatMessage(messages.marketplaceSellerShippingPolicyTitle)}
                    id={ProductDetailTabId.MarketplaceSellerShippingPolicy}
                    className={styles.productInfoContainer}>
                    {marketplaceSellerPolicies && seller.policies.shipping && (
                        <SellerPolicy sku={product.sku} customLink="Marketplace Shipping Details Impression">
                            <Policy html={seller.policies.shipping} />
                        </SellerPolicy>
                    )}
                </TabItem>
                <TabItem
                    tabLabel={intl.formatMessage(messages.marketplaceSellerReturnPolicyTitle)}
                    id={ProductDetailTabId.MarketplaceSellerReturnPolicy}
                    className={styles.productInfoContainer}>
                    {marketplaceSellerPolicies && seller.policies.return && (
                        <SellerPolicy sku={product.sku} customLink="Marketplace Return Policy Impression">
                            <Policy html={seller.policies.return} />
                        </SellerPolicy>
                    )}
                </TabItem>
            </Tabs>
        </div>
    );
};

ProductDetailTab.displayName = "ProductDetailTab";

const mapStateToProps = (state: State): StateProps => ({
    language: state.intl.language,
    screenSize: getScreenSize(state),
    features: state.config.features,
    seller: state.seller?.seller,
});

export default connect<StateProps>(mapStateToProps)(injectIntl(ProductDetailTab));
