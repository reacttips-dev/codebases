import * as React from "react";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import {FormattedMessage} from "react-intl";
import {connect} from "react-redux";
import {IBrowser as ScreenSize} from "redux-responsive/types";
import {bindActionCreators} from "redux";
import {injectIntl, InjectedIntlProps} from "react-intl";
import {CategoryFilter} from "@bbyca/apex-components/dist/models";

import ProductPricing, {hasSavings} from "components/ProductCost/ProductPricing";
import Link from "components/Link";
import Price from "components/Price";
import {State} from "store";
import {getFeatureToggle} from "store/selectors/configSelectors";
import {FEATURE_TOGGLES} from "config/featureToggles";
import {ProductPricingProps} from "components/ProductCost/ProductPricing";
import {
    Region,
    ProductContent,
    Warranty,
    AvailabilityReduxStore,
    DetailedProduct as Product,
    ProductSellerSummary,
    OpenBoxRecommendation,
    GlobalCMSContexts,
    ContextItemTypes,
    isBundle,
    ProductVariant,
    Seller,
    Offer,
    BenefitsMessage,
    SpecialOffer,
} from "models";
import {getProductWarranties} from "utils/productWarranty";
import BadgeWrapper from "components/BadgeWrapper";
import isPurchasable from "utils/isPurchasable";
import GlobalContent from "components/GlobalContent";

import {
    productActionCreators,
    ProductActionCreators,
    offerActionCreators,
    OfferActionCreators,
    geekSquadMembershipDialogActionCreators,
    GeekSquadMembershipDialogActionCreators,
    StoresActionCreators,
} from "../../../../actions";
import MarketplaceSellerInformation from "../MarketplaceSellerInformation";
import ProductAvailability from "../ProductAvailability";
import SpecialOffers from "../SpecialOffers";
import {ProductWarranties} from "../ProductWarranties";
import SaleMessageBox from "../SaleMessageBox";
import CorrectionNotice from "../CorrectionNotice";
import * as styles from "./style.css";
import {OpenBoxOffer} from "../OpenBoxOffer";
import messages from "./translations/messages";
import ProductStateActions from "../ProductStateActions";
import ProductSizeVariants from "../ProductSizeVariants";
import {SoldByBestBuy} from "../SoldByBestBuy";
import {Variants} from "../Variants";
import {ProductServices} from "@bbyca/ecomm-checkout-components/dist/components";
import {ProductService} from "@bbyca/ecomm-checkout-components/dist/business-rules/entities/ProductServices";
import {getBenefitsMessageForSku, getProductServices, getProductSku} from "../../../../store/selectors";
import {Divider} from "@bbyca/bbyca-components";
import {getScreenSize} from "store/selectors";

export interface StateProps {
    appLocationRegionCode: Region;
    isAvailabilityError: boolean;
    loadingVariants: boolean;
    availability: AvailabilityReduxStore;
    baseSwatchUrl: string;
    categoryBreadcrumb: CategoryFilter[];
    displayEhfRegions: Region[];
    geekSquadSubscriptionSKU: string | undefined;
    loadingProduct: boolean;
    loadingStores: boolean;
    locale: Locale;
    product: Product;
    productVariants: ProductVariant[][];
    openBox: OpenBoxRecommendation;
    isAddToCartEnabled: boolean;
    isRpuEnabled: boolean;
    screenSize: ScreenSize;
    sellers: ProductSellerSummary & {loading: boolean};
    specialOffers: SpecialOffer[];
    targettedContent: ProductContent;
    shippingLocation: any;
    warrantyTermsAndConditionUrl: string | undefined;
    warrantyBenefitsMessage?: BenefitsMessage;
    language: Language;
    variantThumbnailEnabled: boolean | undefined;
    seller: Seller;
    offer?: Offer;
    productServicesEnabled?: boolean;
    productServices: ProductService[];
    gspAboveAddToCart: boolean;
}

export interface DispatchProps {
    actions: ProductActionCreators;
    storesActions: StoresActionCreators;
    offerActions: OfferActionCreators;
    geekSquadMembershipDialogActions: GeekSquadMembershipDialogActionCreators;
}

export interface OwnProps {
    selectedWarranty: Warranty | null;
    onSelectWarranty: (warranty: Warranty) => void;
}

const TV_DRIVESANDSTORAGE_CATEGORY_REGEX: RegExp = /(21344)|(20232)/;

export class ProductOfferDetails extends React.Component<DispatchProps & StateProps & InjectedIntlProps & OwnProps> {
    public render() {
        if (!this.props.product || !this.props.offer) {
            return null;
        }

        const availability = this.props.availability;
        const isPreOrder = availability && availability.shipping && availability.shipping.status === "Preorder";
        const isOnlineOnly = this.props.product.isOnlineOnly;
        const isRpuEnabled = this.props.isRpuEnabled;
        const browseMode = this.props.isAddToCartEnabled === false && isRpuEnabled === false;
        const productPricingProps = this.getProductPricingProps();
        const showBadge: boolean = hasSavings(productPricingProps) && isPurchasable(availability);
        const categoryL2 =
            this.props.categoryBreadcrumb &&
            this.props.categoryBreadcrumb.length > 2 &&
            this.props.categoryBreadcrumb[2].categoryId;

        return (
            <>
                {this.props.screenSize.is.extraSmall && <Divider className={styles.divider} />}
                <CorrectionNotice targettedContent={this.props.targettedContent} />
                <BadgeWrapper
                    className={styles.badgeWrp}
                    sku={this.props.product.sku}
                    locale={this.props.intl.locale as Locale}
                    display={showBadge}
                />
                <div className={styles.pricingContainer}>
                    <ProductPricing {...productPricingProps} />
                    <OpenBoxOffer
                        openBox={this.props.openBox}
                        appLocationRegionCode={this.props.appLocationRegionCode}
                        locale={this.props.locale}
                    />
                </div>

                {this.props.gspAboveAddToCart && this.renderProductWarranties()}

                {this.props?.specialOffers?.length > 0 ? (
                    <SpecialOffers
                        trackSpecialOfferClick={this.props.offerActions.trackSpecialOfferClick}
                        specialOffers={this.props.specialOffers}
                        seoName={this.props.product.seoText}
                        sku={this.props.product.sku}
                    />
                ) : null}
                {this.props.productVariants &&
                    this.props.productVariants.length > 0 &&
                    this.props.productVariants[0].length > 0 && (
                        <>
                            <Divider className={styles.dividerSection} />
                            <Variants
                                baseSwatchUrl={this.props.baseSwatchUrl}
                                pageSku={this.props.product.sku}
                                productVariants={this.props.productVariants}
                                loadingVariants={this.props.loadingVariants}
                                variantThumbnailEnabled={this.props.variantThumbnailEnabled}
                                isMarketplace={this.props.product.isMarketplace}
                                locale={this.props.locale}
                            />
                        </>
                    )}
                {availability && !browseMode && !isOnlineOnly && !isPreOrder && !isRpuEnabled && (
                    <GlobalContent context={GlobalCMSContexts.rpuDisabled} contentType={ContextItemTypes.flexMessage} />
                )}
                {!!browseMode && (
                    <GlobalContent context={GlobalCMSContexts.browseMode} contentType={ContextItemTypes.flexMessage} />
                )}
                <SaleMessageBox targettedContent={this.props.targettedContent} />
                {this.shouldRenderSizeVariants() && (
                    <ProductSizeVariants
                        selectedProduct={this.props.product}
                        categoryL2Id={categoryL2} // maps to Adobe L2 audience logic
                    />
                )}
                <div className={styles.productDetails}>
                    <div className={styles.productActionWrapperNonMobile}>
                        <ProductStateActions selectedWarranty={this.props.selectedWarranty} />
                    </div>
                    {!this.props.sellers.loading && this.props.sellers.count > 1 && (
                        <>
                            <Divider className={styles.sellerSectionTop} />
                            <div>
                                <Link
                                    to="productSellers"
                                    className={`${styles.seeAllSellers} x-see-all-sellers`}
                                    params={[this.props.product.sku]}
                                    ariaLabel={this.props.intl.formatMessage(messages.seeAllVendors, {
                                        count: this.props.sellers.count,
                                    })}>
                                    <span>
                                        <FormattedMessage
                                            {...messages.seeAllVendors}
                                            values={{count: this.props.sellers.count}}
                                        />
                                        <Price
                                            value={
                                                this.hasEhf()
                                                    ? this.props.sellers.lowestOffer.pricing.priceWithEhf
                                                    : this.props.sellers.lowestOffer.pricing.priceWithoutEhf
                                            }
                                        />
                                        <KeyboardArrowRight
                                            className={styles.icon}
                                            classes={{
                                                root: styles.arrowIcon,
                                            }}
                                            viewBox={"0 0 20 20"}
                                        />
                                    </span>
                                </Link>
                            </div>
                            <Divider className={styles.sellerSectionBottom} />
                        </>
                    )}
                    <SoldByBestBuy
                        isMarketplace={this.props.product.isMarketplace}
                        className={styles.productByBestBuy}
                    />
                    {!this.props.loadingProduct && this.props.product.isMarketplace && (
                        <MarketplaceSellerInformation seller={this.props.seller} />
                    )}
                    <ProductAvailability
                        isAvailabilityError={this.props.isAvailabilityError}
                        availability={this.props.availability}
                        regionName={this.props.shippingLocation.regionName}
                        productReleaseDate={
                            this.props.product.isPreorderable ? this.props.product.preorderReleaseDate : ""
                        }
                        isMarketplace={this.props.product.isMarketplace}
                        isRpuEnabled={this.props.isRpuEnabled}
                        isSpecialDelivery={this.props.product.isSpecialDelivery}
                        targettedContent={this.props.targettedContent}
                        isAddToCartEnabled={this.props.isAddToCartEnabled}
                        updateStores={this.updateStores}
                        sku={this.props.product.sku}
                        seoText={this.props.product.seoText}
                        loadingStores={this.props.loadingStores}
                        postalCode={this.props.shippingLocation.postalCode}
                        locale={this.props.locale}
                        selectedWarranty={this.props.selectedWarranty}
                    />
                    {!this.props.gspAboveAddToCart && this.renderProductWarranties()}

                    {this.renderProductServices()}
                </div>
            </>
        );
    }

    private updateStores = () => {
        this.props.storesActions.updateStores(this.props.product.sku);
    };

    private isSubscription = () => {
        return this.props.product.sku === this.props.geekSquadSubscriptionSKU;
    };

    private shouldRenderSizeVariants = () => {
        return (this.props.categoryBreadcrumb || []).find((categoryFilter) =>
            TV_DRIVESANDSTORAGE_CATEGORY_REGEX.test(categoryFilter.categoryId),
        );
    };

    private getProductPricingProps(): ProductPricingProps {
        const productPricingProps: ProductPricingProps = {
            displaySaleEndDate: !!this.props.offer?.pricing.saving,
            displaySavingPosition: "top",
            ehf: this.props.offer?.pricing.ehf,
            isSubscription: this.isSubscription(),
            priceSize: "large",
            priceWithEhf: this.props.offer?.pricing.priceWithEhf,
            priceWithoutEhf: this.props.offer?.pricing.priceWithoutEhf,
            saleEndDate: this.props.offer?.pricing.saleEndDate,
            saving: this.props.offer?.pricing.saving,
            superscriptCent: true,
            availabilityStatus:
                this.props.availability && this.props.availability.shipping && this.props.availability.shipping.status,
            disableSeoAttributes: true,
        };
        return productPricingProps;
    }

    private hasEhf(): boolean {
        return (
            this.props.displayEhfRegions.indexOf(this.props.appLocationRegionCode) >= 0 &&
            this.props.sellers.lowestOffer.pricing.ehf > 0
        );
    }

    private renderProductWarranties(): React.ReactNode {
        const {product, onSelectWarranty, warrantyBenefitsMessage, warrantyTermsAndConditionUrl} = this.props;
        if (product?.warranties?.length > 0 && !isBundle(this.props.product)) {
            const requiredWarranties = getProductWarranties(product.warranties);

            if (!requiredWarranties) {
                return null;
            }

            return (
                <>
                    <hr className={styles.dividerSection} />
                    <div className={styles.productWarrantiesContainer}>
                        <ProductWarranties
                            className={styles.productWarranties}
                            parentSku={product.sku}
                            warranties={requiredWarranties}
                            onSelectWarranty={onSelectWarranty}
                            warrantyTermsAndConditionUrl={warrantyTermsAndConditionUrl as string}
                            warrantyBenefitMessage={warrantyBenefitsMessage as BenefitsMessage}
                        />
                    </div>
                </>
            );
        }
        return null;
    }

    private renderProductServices(): React.ReactNode {
        // Mocking services until officially added to product API
        const {productServicesEnabled, productServices} = this.props;
        const services = productServicesEnabled && productServices;
        return (
            Array.isArray(services) &&
            services.length > 0 && (
                <>
                    <Divider className={styles.dividerSection} />
                    <div className={styles.productServicesContainer}>
                        <ProductServices services={services} />
                    </div>
                </>
            )
        );
    }
}

const mapStateToProps = (state: State): StateProps => {
    const dataSources = state.config.dataSources;
    return {
        appLocationRegionCode: state.app.location.regionCode,
        isAvailabilityError: state.product.isAvailabilityError,
        loadingVariants: state.product.loadingVariants,
        availability: state.product.availability,
        baseSwatchUrl: !!dataSources.baseSwatchUrl && dataSources.baseSwatchUrl,
        categoryBreadcrumb:
            state.product.category && state.product.category.categoryBreadcrumb
                ? state.product.category.categoryBreadcrumb
                : [],
        displayEhfRegions: state.config.displayEhfRegions || [],
        geekSquadSubscriptionSKU: state.config?.checkout?.geekSquadSubscriptionSKU,
        loadingProduct: state.product.loadingProduct,
        loadingStores: state.product.loadingStores,
        language: state.intl.language,
        locale: state.intl.locale,
        product: state.product.product,
        specialOffers: state.product.specialOffers,
        seller: state.seller?.seller,
        productVariants: state.product.product && state.product.product.productVariants,
        openBox: state.product.recommendations.openBox,
        isRpuEnabled: !!state.config && !!state.config.remoteConfig && state.config.remoteConfig.isRpuEnabled,
        isAddToCartEnabled:
            !!state.config && !!state.config.remoteConfig && state.config.remoteConfig.isAddToCartEnabled,
        screenSize: getScreenSize(state),
        sellers: state.product.sellers,
        targettedContent: state.product.targettedContent,
        shippingLocation: state.user && state.user.shippingLocation,
        warrantyTermsAndConditionUrl:
            dataSources.warrantyTermsAndConditionsUrl && dataSources.warrantyTermsAndConditionsUrl[state.intl.language],
        warrantyBenefitsMessage: getBenefitsMessageForSku(getProductSku(state))(state) as BenefitsMessage,
        variantThumbnailEnabled: getFeatureToggle(FEATURE_TOGGLES.variantThumbnailEnabled)(state) as boolean,
        offer: state.product.offer,
        productServicesEnabled: getFeatureToggle(FEATURE_TOGGLES.productServicesEnabled)(state) as boolean,
        productServices: getProductServices(state.product.product.sku)(state),
        gspAboveAddToCart: getFeatureToggle(FEATURE_TOGGLES.gspAboveAddToCart)(state) as boolean,
    };
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(productActionCreators, dispatch),
    offerActions: bindActionCreators(offerActionCreators, dispatch),
    geekSquadMembershipDialogActions: bindActionCreators(geekSquadMembershipDialogActionCreators, dispatch),
});

export default connect<StateProps, DispatchProps, OwnProps>(
    mapStateToProps,
    mapDispatchToProps,
)(injectIntl<StateProps & DispatchProps>(ProductOfferDetails));
