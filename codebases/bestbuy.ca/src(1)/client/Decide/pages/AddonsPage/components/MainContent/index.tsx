import * as React from "react";
import {bindActionCreators} from "redux";
import {connect, Dispatch} from "react-redux";
import {FormattedMessage, InjectedIntlProps, injectIntl} from "react-intl";
import {utils as adobeLaunch} from "@bbyca/adobe-launch";
import {Button, GlobalSuccessMessage, Loader} from "@bbyca/bbyca-components";
import {
    Cart,
    PartStatus,
    RequiredProduct,
    CartStatus,
    LineItemType,
} from "@bbyca/ecomm-checkout-components/dist/business-rules/entities";
import {Product} from "@bbyca/ecomm-checkout-components/dist/business-rules/entities/Product";
import {ProductService} from "@bbyca/ecomm-checkout-components/dist/business-rules/entities/ProductServices";
import {ProductDetailsLineItem, ProductServices} from "@bbyca/ecomm-checkout-components/dist/components";
import {isCartStatus, getSeoTextBySku} from "@bbyca/ecomm-checkout-components/dist/redux/cart";
import {
    getRequiredProducts,
    hasRequiredProductsFetchingFailed,
    isRequiredProductsLoading,
    updateRequiredProductsStatuses,
} from "@bbyca/ecomm-checkout-components/dist/redux/requiredProducts";

import {IBrowser as ScreenSize} from "redux-responsive/types";
import routeManager from "utils/routeManager";
import {State as GlobalState} from "store";
import {getFeatureToggle} from "store/selectors/configSelectors";
import {FEATURE_TOGGLES} from "config/featureToggles";
import {
    notificationActionCreators,
    routingActionCreators,
    AppActions,
    addOnsPageActionCreators,
    GSPActionCreators,
    gspActionCreators,
} from "actions";
import {Warranty, BenefitsMessage, Recommendations, Region} from "models";
import {FeatureToggles} from "config";
import {getTermsAndConditionsUrl, getIntlLanguage, getRouting, getScreenSize} from "store/selectors";
import {ErrorState} from "reducers";

import {
    getCart,
    getGspPlansForSku,
    getBenefitsMessageForSku,
    getCartStatus,
    getSelectedGspFromSku,
    getProductServices,
    getSelectedServicesFromSku,
} from "../../../../store/selectors";
import {
    basketActionCreators,
    BasketActionCreators,
    recommendationActionCreators,
    RecommendationActionCreators,
    productRelatedProductsActionCreators,
    ProductRelatedProductsActionCreators,
} from "../../../../actions";
import GspPlan from "../../../../components/GspPlan";
import RequiredPartsButtonsLoader from "./RequiredPartsButtonsLoader";
import * as styles from "./styles.css";
import messages from "../../translations/messages";
import RequiredProducts from "../RequiredProducts";
import BoughtAlsoBought from "../../../../components/BoughtAlsoBought";
import {getParentProduct} from "../../selectors";

export interface StateProps {
    cart: Cart;
    isError?: boolean;
    isLoading?: boolean;
    parentItemJustAddedToCart: boolean;
    parentProduct: Product;
    requiredProducts: RequiredProduct[];
    warranties: Warranty[];
    selectedWarranty: Warranty | null;
    language: Language;
    benefitsMessage: BenefitsMessage;
    gspLoading: boolean;
    productServicesEnabled: boolean;
    showRecosAddToCart: boolean;
    productServices: ProductService[];
    recommendations: Recommendations;
    screenSize: ScreenSize;
    user: any;
    errors: ErrorState;
    appLocationRegionCode: Region;
    locale: Locale;
    youMightAlsoLikeWidgetInAddonsPageEnabled: boolean;
    selectedServices: string[];
}

export interface OwnProps {
    sku: string;
    // TODO: this seems to not be used. Double check and remove it.
    features: FeatureToggles;
}

interface DispatchProps {
    gspActions: GSPActionCreators;
    basketActionCreators: BasketActionCreators;
    recommendationActions: RecommendationActionCreators;
    productRelatedProductsActions: ProductRelatedProductsActionCreators;
}

interface State {
    status: {
        [key: string]: PartStatus;
    };
    // errorCount is used to create keys that reset the GSP components local state
    errorCount: number;
    gspLoading: boolean;
    warrantyBeforeChange: Warranty | null;
    warrantyExisted: boolean;
    servicesRequested: boolean;
}

const mapStateToProps = (state: GlobalState, {sku}: OwnProps) => ({
    language: getIntlLanguage(state),
    sku,
    routing: getRouting(state),
    cartStatus: getCartStatus(state),
    cart: getCart(state),
    isError: hasRequiredProductsFetchingFailed(state.requiredProducts, sku),
    isLoading:
        isRequiredProductsLoading(state.requiredProducts, sku) || isCartStatus(state.cart, CartStatus.PROCESSING),
    parentItemJustAddedToCart: state.addOnsPage.parentItemJustAdded,
    parentProduct: getParentProduct(state, sku),
    seoText: getSeoTextBySku(state.cart, sku),
    requiredProducts: getRequiredProducts(state.requiredProducts, sku),
    warranties: getGspPlansForSku(sku)(state),
    selectedWarranty: getSelectedGspFromSku(sku)(state),
    benefitsMessage: getBenefitsMessageForSku(sku)(state),
    warrantyTermsAndConditionUrl: getTermsAndConditionsUrl(state),
    productServicesEnabled: getFeatureToggle(FEATURE_TOGGLES.productServicesEnabled)(state) as boolean,
    productServices: getProductServices(sku)(state),
    showRecosAddToCart: getFeatureToggle(FEATURE_TOGGLES.showRecosAddToCart)(state) as boolean,
    appLocationRegionCode: state.app.location.regionCode,
    recommendations: state.product?.recommendations,
    screenSize: getScreenSize(state),
    user: state.user,
    errors: state.errors,
    locale: state.intl.locale,
    youMightAlsoLikeWidgetInAddonsPageEnabled: getFeatureToggle(
        FEATURE_TOGGLES.youMightAlsoLikeWidgetInAddonsPageEnabled,
    )(state) as boolean,
    selectedServices: getSelectedServicesFromSku(sku)(state),
});

const mapDispatchToProps = (dispatch: Dispatch<AppActions>, {sku}: OwnProps) => ({
    updateRequiredProductsStatuses: () => dispatch(updateRequiredProductsStatuses(sku)),
    notificationActions: bindActionCreators(notificationActionCreators, dispatch),
    routingActions: bindActionCreators(routingActionCreators, dispatch),
    addOnsPageActions: bindActionCreators(addOnsPageActionCreators, dispatch),
    gspActions: bindActionCreators(gspActionCreators, dispatch),
    recommendationActions: bindActionCreators(recommendationActionCreators, dispatch),
    basketActions: bindActionCreators(basketActionCreators, dispatch),
    productRelatedProductsActions: bindActionCreators(productRelatedProductsActionCreators, dispatch),
});

export type Props = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps> &
    StateProps &
    OwnProps &
    DispatchProps &
    InjectedIntlProps;

export class MainContent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            status: {},
            errorCount: 0,
            gspLoading: false,
            warrantyBeforeChange: null,
            warrantyExisted: false,
            servicesRequested: false,
        };
    }

    public componentDidMount() {
        this.onLoad();

        if (this.props.selectedWarranty) {
            this.setState({warrantyExisted: true});
        }
    }

    public componentWillUnmount() {
        const {warrantyBeforeChange, warrantyExisted} = this.state;
        const {selectedWarranty, sku} = this.props;

        this.props.addOnsPageActions.updateParentItemJustAdded(false);
        this.addWarrantyAnalytics();

        if (warrantyBeforeChange !== null && warrantyExisted === true && selectedWarranty === null) {
            adobeLaunch.pushEventToDataLayer({
                event: "interstitialPage_warrantyremove",
                payload: {
                    sku,
                },
            });
        }
    }

    public componentDidUpdate(prevProps: Props) {
        if (prevProps.isError !== this.props.isError && this.props.isError) {
            this.onConnectionError(this.onLoad);
        }

        if (prevProps.requiredProducts !== this.props.requiredProducts) {
            this.props.requiredProducts.forEach((product) => {
                this.setState((state) => ({
                    ...state,
                    status: {
                        ...state.status,
                        [product.sku]: product.status,
                    },
                }));
            });
        }
        // update the error count so GSP components can be reset
        if (prevProps.cartStatus !== CartStatus.FAILED && this.props.cartStatus === CartStatus.FAILED) {
            this.setState({errorCount: this.state.errorCount + 1});
        }
        if (this.props.productServicesEnabled && !this.state.servicesRequested) {
            this.setState((state) => {
                this.props.productRelatedProductsActions.getRelatedServices(this.props.sku);
                return {...state, servicesRequested: true};
            });
        }
    }

    public render() {
        const {
            intl,
            isError,
            isLoading,
            parentItemJustAddedToCart,
            parentProduct,
            seoText,
            requiredProducts,
            warranties,
            selectedWarranty,
            gspActions,
            benefitsMessage,
            warrantyTermsAndConditionUrl,
            sku,
            productServicesEnabled,
            recommendations,
            recommendationActions,
            basketActions,
            locale,
            offer,
            youMightAlsoLikeWidgetInAddonsPageEnabled,
            productServices,
        } = this.props;
        const hasRequiredProducts = requiredProducts && requiredProducts.length > 0;
        const hasWarranties = warranties && warranties.length > 0;
        const hasMultipleSections = hasRequiredProducts && hasWarranties;
        const seoBlurb = seoText ? `${seoText}/` : "";
        const intlLocale = intl?.locale ? `/${intl.locale?.toLowerCase()}` : "";
        const productUrl = `${intlLocale}/product/${seoBlurb}${parentProduct?.sku}`;
        const hasServices = productServicesEnabled && productServices?.length > 0;

        const handleWarrantyChange = async (parentSku: string, warranty: Warranty | null) => {
            this.setState({gspLoading: true, warrantyBeforeChange: this.props.selectedWarranty});
            await this.props.addOnsPageActions.updateWarrantyForSku(parentSku, warranty);
            this.setState({gspLoading: false});
        };

        let numberOfButtons = 1;

        if (parentItemJustAddedToCart) {
            numberOfButtons = 2;
        }
        return (
            <div className={styles.pageContainer}>
                <div className={styles.addonsPageContainer}>
                    <div className={styles.addonsPageContentContainer}>
                        {parentItemJustAddedToCart && (
                            <div className={styles["item-added-message"]}>
                                <GlobalSuccessMessage message={intl.formatMessage(messages.itemAdded)} />
                            </div>
                        )}
                        <div className={styles.parentProductContainer}>
                            {/* TODO: check why  ProductDetailsLineItem is not displayed on error*/}
                            {!isError && (
                                <ProductDetailsLineItem
                                    {...parentProduct}
                                    productUrl={productUrl}
                                    isLoading={isLoading !== false}
                                />
                            )}
                        </div>
                    </div>
                    {(hasRequiredProducts || hasServices) && (
                        <>
                            <h3 className={styles.sectionTitle}>
                                <FormattedMessage {...messages.forDeliveryDay} />
                            </h3>
                            <div className={styles.addonsPageContentContainer}>
                                {hasRequiredProducts && (
                                    <RequiredProducts
                                        className={hasMultipleSections ? styles.borderBottom : undefined}
                                        isError={isError}
                                        isLoading={isLoading}
                                        requiredProducts={requiredProducts}
                                        parentProduct={parentProduct}
                                        parentItemJustAddedToCart={parentItemJustAddedToCart}
                                        onUpdateStatus={this.updateStatus}
                                        statusBySku={this.state.status}
                                        onConnectionError={this.onConnectionError}
                                    />
                                )}
                                {hasServices && this.renderProductServices()}
                            </div>
                        </>
                    )}
                    {hasWarranties && (
                        <>
                            <h3 className={styles.sectionTitle}>
                                <FormattedMessage {...messages.productProtection} />
                            </h3>
                            <div className={styles.addonsPageContentContainer}>
                                <div className={styles.gspContainer}>
                                    <GspPlan
                                        key={`gsp-${this.state.errorCount}`}
                                        noWidthCap={true}
                                        initialOption={selectedWarranty}
                                        locale={intl.locale as Locale}
                                        onOptionSelected={handleWarrantyChange}
                                        options={warranties}
                                        warrantyTermsAndConditionUrl={warrantyTermsAndConditionUrl as string}
                                        isBenefitsTextOpen={true}
                                        parentSku={sku}
                                        fetchWarrantyBenefits={gspActions.fetchWarrantyBenefits}
                                        benefitsMessage={benefitsMessage}
                                        isGspLoading={this.state.gspLoading}
                                        disableCtas={false}
                                        trackEngagements
                                    />
                                </div>
                            </div>
                        </>
                    )}
                    {recommendations?.boughtAlsoBought && youMightAlsoLikeWidgetInAddonsPageEnabled && (
                        <BoughtAlsoBought
                            screenSize={this.props.screenSize}
                            regionName={this.props.user.shippingLocation.regionName}
                            recommendationProducts={recommendations?.boughtAlsoBought}
                            getRecommendationAvailabilities={recommendationActions.getRecommendationAvailabilities}
                            onGotoBasketPage={basketActions.goToCartPage}
                            errors={this.props.errors}
                            noCrawl={true}
                            showAddToCartButton={this.props.features.showRecosAddToCart}
                            locale={locale}
                            appLocationRegionCode={this.props.appLocationRegionCode}
                            hideDivider
                            location="Interstitial BAB"
                            TitleComponent="h3"
                            titleProps={{className: styles.ymalWidgetTitle}}
                            containerProps={{className: styles.ymalContainer}}
                        />
                    )}
                    <Loader
                        loading={isLoading}
                        loadingDisplay={<RequiredPartsButtonsLoader numberOfButtons={numberOfButtons} />}>
                        <div className={styles.footer}>{this.renderButtons()}</div>
                    </Loader>
                </div>
            </div>
        );
    }

    private onLoad = () => {
        this.props.addOnsPageActions.onLoad(this.props.sku);
    };

    private updateStatus = (sku: string, status: PartStatus): void => {
        this.setState((state) => ({
            ...state,
            status: {
                ...state.status,
                [sku]: status,
            },
        }));
    };

    private addWarrantyAnalytics = () => {
        if (this.state.warrantyExisted === false && this.props.selectedWarranty !== null) {
            const shipments = this.props.cart?.shipments;
            shipments?.forEach((shipment) => {
                if (shipment.seller.id === "bbyca") {
                    shipment.lineItems.forEach((item) => {
                        item.children?.forEach((child) => {
                            const productServicePlan = child.lineItemType === LineItemType.Psp;
                            if (productServicePlan && item?.quantity <= 1) {
                                adobeLaunch.pushEventToDataLayer({
                                    event: "interstitialPage_warrantyadd",
                                    payload: {
                                        selectedWarranty: this.props.selectedWarranty,
                                        parentProduct: this.props.parentProduct,
                                    },
                                });
                            }
                        });
                    });
                }
            });
        }
    };

    private renderProductServices(): React.ReactNode {
        const {productServicesEnabled, productServices, selectedServices} = this.props;
        const services = productServicesEnabled && productServices;
        return (
            services && (
                <>
                    <h4 className={styles.contentTitle}>
                        <FormattedMessage {...messages.youMightAlsoNeed} />
                    </h4>
                    <div className={styles.productServicesContainer}>
                        <ProductServices
                            services={services}
                            selectedServices={selectedServices}
                            selectable
                            hideBenefits={false}
                            onChange={(value: string[]) => {
                                this.servicesChangeHandler(value);
                            }}
                        />
                    </div>
                </>
            )
        );
    }

    private servicesChangeHandler(services: string[]) {
        const {addOnsPageActions, sku} = this.props;
        addOnsPageActions.updateServicesForSku(sku, services);
    }

    private renderButtons = () => {
        const {intl, parentItemJustAddedToCart} = this.props;
        const isDisabled = this.isDisabled();

        return (
            <>
                <Button
                    className={styles.goToCartButton}
                    appearance="primary"
                    href="javascript:void(0);"
                    onClick={() =>
                        parentItemJustAddedToCart ? !isDisabled && this.goToBasketPage() : this.goToBasketPage()
                    }
                    isDisabled={parentItemJustAddedToCart ? isDisabled : undefined}
                    extraAttrs={{"data-automation": "go-to-cart"}}>
                    {parentItemJustAddedToCart
                        ? intl.formatMessage(messages.goToCart)
                        : intl.formatMessage(messages.backToCart)}
                </Button>
                {parentItemJustAddedToCart && (
                    <Button
                        className={styles.continueShoppingButton}
                        appearance="tertiary"
                        href="javascript:void(0);"
                        onClick={() => !isDisabled && this.goToPDP()}
                        isDisabled={isDisabled}
                        extraAttrs={{"data-automation": "continue-shopping"}}>
                        {intl.formatMessage(messages.continueShopping)}
                    </Button>
                )}
            </>
        );
    };

    private isDisabled = (): boolean => {
        return Object.values(this.state.status).some((status) => status === "initial");
    };

    // TODO: refactor this to use a link or anchor tag
    private goToBasketPage = () => {
        this.props.routingActions.push(routeManager.getPathByKey(this.props.language, "basket"));
    };

    // TODO: refactor this to use a link or anchor tag
    private goToPDP = () => {
        this.props.routingActions.push(routeManager.getPathByKey(this.props.language, "product", "", this.props.sku));
    };

    // TODO: refactor this. No need to wrap the function.
    private onConnectionError = (...params) => {
        this.props.notificationActions.connectionError(...params);
    };
}

export const MainContentWithIntl = injectIntl(MainContent);

export default connect(mapStateToProps, mapDispatchToProps)(MainContentWithIntl);
