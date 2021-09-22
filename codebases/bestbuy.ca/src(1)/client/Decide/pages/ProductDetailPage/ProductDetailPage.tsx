import {utils as adobeLaunch} from "@bbyca/adobe-launch";
import * as React from "react";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {IBrowser as ScreenSize} from "redux-responsive/types";
import {scroller} from "react-scroll";
import {Divider} from "@material-ui/core";
import {ProductService} from "@bbyca/ecomm-checkout-components/dist/business-rules/entities/ProductServices";

import {
    searchActionCreators,
    SearchActionCreators,
    userActionCreators,
    UserActionCreators,
    adActionCreators,
    AdActionCreators,
    availabilityActionCreators,
    AvailabilityActionCreators,
    recommendationActionCreators,
    RecommendationActionCreators,
    offerActionCreators,
    OfferActionCreators,
} from "actions";
import BreadcrumbList from "components/BreadcrumbList";
import Header from "components/Header";
import HeadTags, {InlineScript} from "components/HeadTags";
import PageContent from "components/PageContent";
import {
    BlueShirtChatEvents,
    Category,
    CategoryFilter,
    CustomerReviews,
    DetailedProduct as Product,
    Warranty,
    GlobalCMSContexts,
    ContextItemTypes,
    GlobalContentState,
    GlobalCMSContext,
    Offer,
    AvailabilityReduxStore,
    Region,
    BreadcrumbListItem,
} from "models";
import {ErrorState, RoutingState, UserState, BazaarVoiceJSState, SellerOffer} from "reducers";
import {bindActionCreators} from "redux";
import {State} from "store";
import routeManager from "utils/routeManager";
import {createBreadcrumbList} from "utils/builders/breadcrumbBuilder/createBreadcrumbList";
import Footer from "components/Footer";
import {GeoLocationError} from "errors";
import {
    convertLocaleToBazaarVoiceLocale,
    sendProductContentCollection,
    convertProductToBVProductCatalogue,
} from "utils/productContentCollection";
import {BazaarVoice, FeatureToggles, TestPencilAdIds} from "config";
import GlobalContent from "components/GlobalContent";
import AdLoader, {AdLoaderProps} from "components/Advertisement/AdLoader";
import {AdItem, AvailableAdFormats, buildAdItemsFromGlobalContentContext} from "components/Advertisement";
import {AdTargetingProps, PDPAdTargetingProps} from "components/Advertisement/GooglePublisherTag";
import {getFeatureToggle} from "store/selectors/configSelectors";
import {FEATURE_TOGGLES} from "config/featureToggles";

import {
    productActionCreators,
    ProductActionCreators,
    geekSquadMembershipDialogActionCreators,
    GeekSquadMembershipDialogActionCreators,
    productSellersActionCreators,
    ProductSellersActionCreators,
    bazaarVoiceJSActionCreators,
    BazaarVoiceJSActionCreators,
    productVariantActionCreators,
    ProductVariantActionCreators,
    productRelatedProductsActionCreators,
    ProductRelatedProductsActionCreators,
} from "../../actions";
import {getProductServices, getScreenSize} from "../../../store/selectors";
import BreadcrumbPlaceholder from "../../components/BreadcrumbPlaceholder";
import {ProductHeader} from "./components/ProductHeader";
import ProductBody from "./components/ProductBody";
import ProductFooter from "./components/ProductFooter";
import {ProductDetailTabId} from "./components/ProductDetailTab";
import messages from "./translations/messages";
import ProductOfferDetails from "./components/ProductOfferDetails";
import ProductStateActions from "./components/ProductStateActions";
import {sendPageAnalytics} from "./utils/bazaarVoiceAnalytics";
import * as styles from "./style.css";
import {MobileOfferDetails, MobilePlansInquiryButton} from "./components/MobileOfferDetails";
import {Location} from "history";
import isSamePdp from "Decide/pages/ProductDetailPage/utils/isSamePdp";
import {createProductJsonld, createBreadcrumbJsonld} from "./Product";
import {isArray} from "lodash-es";
import {OneWorldSync, getSyndigoScript, SYNDIGO_FRENCH_SITE_ID, SYNDIGO_ENGLISH_SITE_ID} from "./vendorScripts";

export interface StateProps extends Pick<FeatureToggles, "bazaarvoiceSellerReviewsEnabled" | "productServicesEnabled"> {
    appEnv: string;
    category: Category;
    customerReviews: CustomerReviews;
    errors: ErrorState;
    language: Language;
    product: Product;
    routing: RoutingState;
    screenSize: ScreenSize;
    user: UserState;
    bazaarvoiceConfig: BazaarVoice;
    locale: Locale;
    globalContent: GlobalContentState;
    oneWorldSyncContentAggregationEnabled: boolean;
    syndigoContentAggregationEnabled: boolean;
    phonesPlanCategoryId: string;
    offer?: Offer;
    availability: AvailabilityReduxStore;
    displayEhfRegions: Region[];
    appLocationRegionCode: Region;
    bazaarVoiceJS: BazaarVoiceJSState;
    sellerOffers: SellerOffer[];
    productServicesEnabled?: boolean;
    productServices: ProductService[];
    testPencilAdIds: TestPencilAdIds;
}

export interface DispatchProps {
    actions: ProductActionCreators;
    adActions: AdActionCreators;
    recommendationActions: RecommendationActionCreators;
    offerActions: OfferActionCreators;
    searchActions: SearchActionCreators;
    productSellerActions: ProductSellersActionCreators;
    geekSquadMembershipDialogActions: GeekSquadMembershipDialogActionCreators;
    userActions: UserActionCreators;
    bazaarVoiceJSActions: BazaarVoiceJSActionCreators;
    availabilityActions: AvailabilityActionCreators;
    productVariantActions: ProductVariantActionCreators;
    productRelatedProductsActions: ProductRelatedProductsActionCreators;
}

export interface OwnState {
    selectedWarranty: Warranty | null;
    scrollIntoViewTabId: ProductDetailTabId | null;
    hasRequestedForServices: boolean;
}

export type ProductDetailPageProps = DispatchProps & StateProps & InjectedIntlProps;

export class ProductDetailPage extends React.Component<ProductDetailPageProps, OwnState> {
    public static displayName: string = "ProductDetailPage";
    private scripts: Array<{src: string; async: boolean | undefined}> = [];

    constructor(props: ProductDetailPageProps) {
        super(props);
        this.state = {
            selectedWarranty: null,
            scrollIntoViewTabId: null,
            hasRequestedForServices: false,
        };

        if (this.props.bazaarvoiceConfig.product.dccBvLoader.src) {
            this.scripts.push({
                src: this.props.bazaarvoiceConfig.product.dccBvLoader.src.replace(
                    "-locale-",
                    convertLocaleToBazaarVoiceLocale(this.props.locale),
                ),
                async: this.props.bazaarvoiceConfig.product.dccBvLoader.async,
            });
        }

        // IMPORTANT: The actions to load additional product information such as media are called asyncronously and
        // their render order was not important until the component fetched on every page load. Now, with an optimized
        // component that fetches data only when PDP/SKU has changed (PDP -> Home -> PDP, PDP -> PDP) and not when
        // navigating back and forth to auxiliary pages (PDP -> Reviews -> PDP), it important to clear product data
        // when the component loads with a different SKU/PDP (i.e PDP -> Home -> PDP). PDP -> PDP and PDP -> Reviews -> PDP
        // cases are handled by "componentDidUpdate".
        const isReplacedSku =
            this.props.routing.previousLocationBeforeTransitions &&
            !isSamePdp(this.props.routing, this.props.language, routeManager);
        if (isReplacedSku) {
            this.props.actions.resetProductState();
        }

        this.props.bazaarVoiceJSActions.loadedProductReviewsJS();
    }

    public render() {
        let links = [];
        let metaTags = [];
        let pdpAdLoaderProps: AdLoaderProps;

        const shouldDisplayMobileActivation =
            this.props.product && !this.props.product.isMarketplace && this.isUnderPhonesPlan(this.props.category);
        const disableSeoAttributesToggle = true;
        const pageContentProps = disableSeoAttributesToggle
            ? {}
            : {itemScope: true, itemType: "http://schema.org/Product"};

        if (this.props.product) {
            if (this.props.product.seoText) {
                const canonicalUrl = routeManager.getCanonicalUrlByKey(
                    this.props.language,
                    "product",
                    this.props.product.seoText,
                    this.props.product.sku,
                );

                links = [...links, canonicalUrl && {rel: "canonical", href: canonicalUrl}];
            }

            metaTags = [
                ...metaTags,
                this.props.product.shortDescription && {
                    content: this.props.product.shortDescription.replace(this.props.product.modelNumber, ""),
                    name: "description",
                },
            ];

            const baseAdTargetingProps: AdTargetingProps = {
                environment: this.props.appEnv,
                lang: this.props.locale,
            };
            const pdpFooterGlobalContentContext =
                this.props.globalContent &&
                this.props.globalContent.content &&
                (this.props.globalContent.content["pdp-footer"] as GlobalCMSContext);
            const pencilAdABCtestItems = !!this.props.testPencilAdIds ? [
                {
                    format: AvailableAdFormats.pencilAd,
                    id: this.props.testPencilAdIds.pdp,
                },
            ]: [];
            const items: AdItem[] = [
                ...pencilAdABCtestItems,
                ...buildAdItemsFromGlobalContentContext(pdpFooterGlobalContentContext),
            ];
            const categoryBreadcrumb =
                this.props.category &&
                this.props.category.categoryBreadcrumb &&
                this.props.category.categoryBreadcrumb.map(({categoryId}) => categoryId).join(",");
            pdpAdLoaderProps = {
                items,
                adTargetingProps: this.buildPDPAdTargetingProps(
                    this.props.product.sku,
                    categoryBreadcrumb,
                    baseAdTargetingProps,
                ),
                callbackOnAdRendered: this.props.adActions.adLoaded,
                isReady: !!categoryBreadcrumb,
            };
        }

        return (
            <>
                {this.props.product && (
                    <HeadTags
                        title={this.props.intl.formatMessage(messages.title, {name: this.props.product.name})}
                        links={links}
                        metaTags={metaTags}
                        scripts={this.scripts}
                        inlineScripts={this.getInlineScripts()}
                    />
                )}
                <Header />
                <PageContent extraProps={pageContentProps}>
                    {!this.getBreadcrumbList()?.length ? (
                        <BreadcrumbPlaceholder />
                    ) : (
                        <BreadcrumbList
                            breadcrumbListItems={this.getBreadcrumbList()}
                            className={styles.customBreadcrumbListPadding}
                            disableSeoAttributes={disableSeoAttributesToggle}
                        />
                    )}
                    <ProductHeader
                        onReviewsClicked={this.setActiveTabToCustomerReviews}
                        onVideoPlay={this.onVideoPlay}
                        disableSeoAttributes={disableSeoAttributesToggle}>
                        {this.getProductOfferDetails(this.props.product, this.props.category)}
                    </ProductHeader>
                    <ProductBody
                        scrollIntoViewTabId={this.state.scrollIntoViewTabId}
                        disableSeoAttributes={disableSeoAttributesToggle}
                    />
                    <ProductFooter disableSeoAttributes={disableSeoAttributesToggle}>
                        {this.props.screenSize.lessThan.small &&
                            (shouldDisplayMobileActivation ? (
                                <div className={styles.mobilePlanInquiryToolBar}>
                                    <MobilePlansInquiryButton
                                        sku={this.props.product && this.props.product.sku}
                                        seoText={this.props.product && this.props.product.seoText}
                                    />
                                </div>
                            ) : (
                                <ProductStateActions selectedWarranty={this.state.selectedWarranty} />
                            ))}
                    </ProductFooter>
                    <AdLoader {...pdpAdLoaderProps} />
                    <GlobalContent
                        context={GlobalCMSContexts.pdpFooter}
                        contentType={ContextItemTypes.customContent}
                        before={() => <Divider className={styles.pdpFooterAdsBeforeDivider} />}
                    />
                </PageContent>
                <Footer />
            </>
        );
    }

    public dispatchBlueShirtAgentOnPdp = (isPdp: boolean) => {
        window.dispatchEvent(
            new CustomEvent(BlueShirtChatEvents.BLUE_SHIRT_AGENT_IFRAME_PDP_STYLE, {
                detail: {
                    isPdp,
                },
            }),
        );
    };

    public async componentDidMount() {
        if (typeof window !== undefined && this.props.syndigoContentAggregationEnabled) {
            this.addSyndigoScriptToHead();
        }

        if (typeof window !== undefined && this.props.oneWorldSyncContentAggregationEnabled) {
            this.addOneWorldSyncScriptToHead();
        }

        // Due to technical limitation of BV scripts to replace another BV script's context forces
        // best buy to reload the page when cross script page visit happens in SPA. This is a
        // temporary fix which will be addressed by either BV or BBY moving to use BV API.
        if (this.props.bazaarVoiceJS.isloadedSellerReviewsJS && this.props.bazaarvoiceSellerReviewsEnabled) {
            location.reload();
        }
        await this.props.userActions.locate(true);
        await this.getProductDetails(this.props.routing.locationBeforeTransitions);
        if (this.props.product?.sku) {
            await this.props.productSellerActions.getOffers(this.props.product.sku);
        }

        const bvProductCatalogue = convertProductToBVProductCatalogue(this.props.product);
        sendProductContentCollection(bvProductCatalogue, this.props.locale);

        // send BazaarVoice page analytics
        sendPageAnalytics(this.props.product, this.props.customerReviews);
        this.dispatchBlueShirtAgentOnPdp(true);
    }

    public componentWillUnmount() {
        this.props.availabilityActions.clearAvailability();
        this.dispatchBlueShirtAgentOnPdp(false);
    }

    public componentWillReceiveProps(nextProps: ProductDetailPageProps) {
        if (
            this.props.bazaarvoiceSellerReviewsEnabled !== nextProps.bazaarvoiceSellerReviewsEnabled &&
            this.props.bazaarVoiceJS.isloadedSellerReviewsJS
        ) {
            location.reload();
        }

        if (
            typeof window !== undefined &&
            this.props.syndigoContentAggregationEnabled !== nextProps.syndigoContentAggregationEnabled
        ) {
            this.addSyndigoScriptToHead();
        }

        if (
            typeof window !== undefined &&
            this.props.oneWorldSyncContentAggregationEnabled !== nextProps.oneWorldSyncContentAggregationEnabled
        ) {
            this.addOneWorldSyncScriptToHead();
        }
    }

    public async componentDidUpdate(prevProps: ProductDetailPageProps) {
        if (this.props.routing.locationBeforeTransitions !== prevProps.routing.locationBeforeTransitions) {
            this.props.actions.resetProductState();
            await this.getProductDetails(this.props.routing.locationBeforeTransitions);
        }

        if (
            prevProps.productServicesEnabled === false &&
            this.props.productServicesEnabled === true &&
            !this.state.hasRequestedForServices
        ) {
            this.props.productRelatedProductsActions.getRelatedServices(this.props.product.sku);
            this.setState({hasRequestedForServices: true});
        }
    }

    private getBreadcrumbList(): BreadcrumbListItem[] | [] {
        return this.props.product
            ? createBreadcrumbList(this.props, [{label: this.props.intl.formatMessage(messages.productDetails)}])
            : [];
    }

    private getProductOfferDetails = (product: Product, category: Category): React.ReactNode => {
        // Both the category and product API data is required to render appropriate OfferDetails
        if (!category || !product || product.isMarketplace === undefined || product.isMarketplace === null) {
            return null;
        }

        if (!product.isMarketplace && this.isUnderPhonesPlan(category)) {
            return <MobileOfferDetails />;
        }

        return (
            <ProductOfferDetails
                selectedWarranty={this.state.selectedWarranty}
                onSelectWarranty={this.onSelectWarranty}
            />
        );
    };

    private setActiveTabToCustomerReviews = () => {
        this.setState({scrollIntoViewTabId: ProductDetailTabId.Reviews});
        scroller.scrollTo(ProductDetailTabId.Reviews, {
            delay: 100,
            duration: 1000,
            smooth: true,
            offset: this.props.screenSize.greaterThan.small && 50,
        });
    };

    private isUnderPhonesPlan = (category: Category) => {
        const categories = category && category.categoryBreadcrumb;

        return (
            Array.isArray(categories) &&
            categories.filter(
                (categoryFilter: CategoryFilter) => categoryFilter.categoryId === this.props.phonesPlanCategoryId,
            ).length > 0
        );
    };

    private onVideoPlay = () => {
        adobeLaunch.pushEventToDataLayer({
            event: "video-clicked",
        });
    };

    private async getProductDetails(location?: Location) {
        try {
            await this.props.actions.syncProductStateWithLocation(location, false);
            this.getAdditionalData(location);
        } catch (error) {
            return;
        }
    }

    private async getAdditionalData() {
        // Navigating from server side rendered PDP auxiliary page to PDP should check the availability of data
        const isAdditionalDataAvailable = this.props.product && this.props.product.productVariants && this.props.offer;
        const shouldGetAdditionalData =
            !isSamePdp(this.props.routing, this.props.language, routeManager) || !isAdditionalDataAvailable;

        const error = this.props.errors.error;

        if (!error || error instanceof GeoLocationError) {
            if (shouldGetAdditionalData) {
                this.props.recommendationActions.getRecommendations();
                this.props.actions.getShowcaseBannerContent();
                // If for some reason offer is not loaded by productAction, below call will load offer
                // because without offer price will not be displayed. This is to ensure offer is always available.
                if (!this.props.offer) {
                    this.props.offerActions.getOffers();
                }
                this.props.productVariantActions.getProductVariants();
            }
            this.props.actions.trackPageView();
        }

        if (this.props.productServicesEnabled === true && !this.state.hasRequestedForServices) {
            this.props.productRelatedProductsActions.getRelatedServices(this.props.product.sku);
            this.setState({hasRequestedForServices: true});
        }
    }

    private onSelectWarranty = (warranty: Warranty) => {
        this.setState({selectedWarranty: warranty});
    };

    private buildPDPAdTargetingProps(sku, breadcrumb, baseAdTargetingProps: AdTargetingProps) {
        return {...baseAdTargetingProps, sku, breadcrumb} as PDPAdTargetingProps;
    }

    private hasScriptAlreadyAppended(id: string) {
        return !!document.getElementById(id);
    }

    private addSyndigoScriptToHead() {
        if (!this.hasScriptAlreadyAppended("syndigo-content-delivery")) {
            document.head.appendChild(this.getSyndigoScript());
        }
    }

    private getSyndigoScript() {
        const syndigoScript = document.createElement("script");
        syndigoScript.id = "syndigo-content-delivery";
        syndigoScript.type = "text/javascript";
        const siteId = this.props.locale === "fr-CA" ? SYNDIGO_FRENCH_SITE_ID : SYNDIGO_ENGLISH_SITE_ID;
        syndigoScript.innerHTML = getSyndigoScript(siteId);
        return syndigoScript;
    }

    private addOneWorldSyncScriptToHead() {
        if (!this.hasScriptAlreadyAppended("one-world-sync")) {
            document.head.appendChild(this.getOneWorldSyncScript());
        }
    }

    private getOneWorldSyncScript() {
        const oneWorldScript = document.createElement("script");
        oneWorldScript.id = "one-world-sync";
        oneWorldScript.type = "text/javascript";
        oneWorldScript.innerHTML = OneWorldSync;
        return oneWorldScript;
    }

    private getInlineScripts(): InlineScript[] {
        const inlineScripts: InlineScript[] = [];
        const hasEhf =
            this.props.displayEhfRegions &&
            isArray(this.props.displayEhfRegions) &&
            this.props.displayEhfRegions.indexOf(this.props.appLocationRegionCode) >= 0 &&
            this.props.product.ehf > 0;

        inlineScripts.push({
            key: "product-json-ld",
            value: JSON.stringify(createProductJsonld(this.props, hasEhf, this.props.sellerOffers)),
            type: "application/ld+json",
        });
        inlineScripts.push({
            key: "breadcrumb-json-ld",
            value: this.getBreadcrumbList()?.length
                ? JSON.stringify(createBreadcrumbJsonld(this.getBreadcrumbList(), this.props.locale))
                : "",
            type: "application/ld+json",
        });

        return inlineScripts;
    }
}

const mapStateToProps: MapStateToProps<StateProps, {}, State> = (state) => {
    return {
        appEnv: state.app.environment.appEnv,
        category: state.product.category,
        customerReviews: state.product.customerReviews,
        errors: state.errors,
        language: state.intl.language,
        product: state.product.product,
        routing: state.routing,
        screenSize: getScreenSize(state),
        user: state.user,
        bazaarvoiceConfig: state.config.bazaarvoice,
        locale: state.intl.locale,
        globalContent: state.app.globalContent,
        syndigoContentAggregationEnabled: state.config.features.syndigoContentAggregationEnabled,
        oneWorldSyncContentAggregationEnabled: state.config.features.oneWorldSyncContentAggregationEnabled,
        phonesPlanCategoryId: state.config.cellphonePlansCategoryId,
        offer: state.product.offer,
        sellerOffers: state.productSellers.sellerOffers,
        availability: state.product.availability,
        displayEhfRegions: state.config.displayEhfRegions || [],
        appLocationRegionCode: state.app.location.regionCode,
        bazaarVoiceJS: state.bazaarVoiceJS,
        bazaarvoiceSellerReviewsEnabled: !!state.config.features.bazaarvoiceSellerReviewsEnabled,
        productServicesEnabled: getFeatureToggle(FEATURE_TOGGLES.productServicesEnabled)(state) as boolean,
        testPencilAdIds: state.config.testPencilAdIds,
        productServices: getProductServices(state.product?.product?.sku)(state),
    };
};

PageContent.displayName = "PageContent";
ProductHeader.displayName = "ProductHeader";
BreadcrumbList.displayName = "BreadcrumbList";

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = (dispatch) => {
    return {
        actions: bindActionCreators(productActionCreators, dispatch),
        adActions: bindActionCreators(adActionCreators, dispatch),
        recommendationActions: bindActionCreators(recommendationActionCreators, dispatch),
        offerActions: bindActionCreators(offerActionCreators, dispatch),
        searchActions: bindActionCreators(searchActionCreators, dispatch),
        productSellerActions: bindActionCreators(productSellersActionCreators, dispatch),
        geekSquadMembershipDialogActions: bindActionCreators(geekSquadMembershipDialogActionCreators, dispatch),
        userActions: bindActionCreators(userActionCreators, dispatch),
        bazaarVoiceJSActions: bindActionCreators(bazaarVoiceJSActionCreators, dispatch),
        availabilityActions: bindActionCreators(availabilityActionCreators, dispatch),
        productVariantActions: bindActionCreators(productVariantActionCreators, dispatch),
        productRelatedProductsActions: bindActionCreators(productRelatedProductsActionCreators, dispatch),
    };
};

export default connect<StateProps, DispatchProps, {}, State>(
    mapStateToProps,
    mapDispatchToProps,
)(injectIntl<StateProps & DispatchProps>(ProductDetailPage));
