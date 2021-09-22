import * as React from "react";
import {FormattedMessage, InjectedIntlProps, injectIntl} from "react-intl";
import {connect} from "react-redux";
import {get} from "lodash-es";
import {bindActionCreators} from "redux";
import {IBrowser as ScreenSize} from "redux-responsive";
import {scroller} from "react-scroll";
import {
    analyticsPostalCodeUpdated as analyticsPostalCodeUpdatedAction,
    BasketShippingStatus,
    clearCartFailureCode,
    CostSummary,
    formatPrice,
    getEnRegionName,
    RequiredProduct,
    ServicePlanType,
} from "@bbyca/ecomm-checkout-components";
import {
    Button,
    ErrorToaster,
    GlobalMessage,
    GlobalWarningMessage,
    Loader,
    LoadingSpinner,
} from "@bbyca/bbyca-components";
import {tracker} from "@bbyca/ecomm-utilities";
import {cachedFetchSimpleRequiredProducts} from "@bbyca/ecomm-checkout-components/dist/redux";
import {ProductService} from "@bbyca/ecomm-checkout-components/dist/business-rules/entities/ProductServices";
import {CheckoutFlow, GSPState, RoutingState} from "reducers";
import {State} from "store";
import Header from "components/Header";
import HeadTags, {Meta} from "components/HeadTags";
import PageContent from "components/PageContent";
import TitleHeader from "components/TitleHeader";
import {ClientConfig, FeatureToggles, ServerConfig} from "config";
import {
    basketActionCreators,
    BasketActionCreators,
    gspActionCreators,
    GSPActionCreators,
    productActionCreators,
    routingActionCreators,
    RoutingActionCreators,
} from "actions";
import {productRelatedProductsActionCreators, ProductRelatedProductsActionCreators} from "../../actions";
import {ProductListActionCreators, productListActionCreators} from "../../actions/productListActions";
import Footer from "components/Footer";
import {CartLineItem, Dispatch, Promotion, PromotionalBadges, Region, Summary, Warranty, WarrantyType} from "models";
import {
    getCartPageCartStatus,
    getCartPageErrorType,
    getConfig,
    getConfigFeatures,
    getFeatureToggle,
    getGspState,
    getIntlLanguage,
    getLocationBeforeTransitions,
    getProductListError,
    getProductListLineItems,
    getProductListStatus,
    getPromotionalBadges,
    getQuebecLegalWarrantyUrl,
    getScreenSize,
    getTermsAndConditionsUrl,
    getUserShippingLocationCity,
    getUserShippingLocationPostalCode,
    getUserShippingLocationRegionCode,
    isKiosk as isKioskEnv,
    isLightWeightBasketEnabled as isLightWeightBasketEnabledSelector,
    isQueueItEnabled as isQueueItEnabledSelector,
    isRpuEnabled as isRpuEnabledSelector,
} from "store/selectors";
import {setGspTracking, trackGsp} from "utils/analytics/gspInCart";
import groupBy from "utils/groupBy";
import {CartStatus} from "../../reducers/cartPageReducer";
import {FEATURE_TOGGLES} from "config/featureToggles";
import {FeatureToggle} from "components/FeatureToggle";
import {classIf, classname} from "utils/classname";

import EnterPostalCode from "../../components/EnterPostalCode";
import {messages as tcMessages, TermsAndConditionsLink} from "../../components/TermsAndConditions";
import OrderPromotionItems from "./components/OrderPromoItems";
import {
    CheckoutButtonData,
    getBasketId,
    getCartShippingStatus,
    getCheckoutButtonData,
    getIsLoading,
    getLineItems,
    getLineItemsNotRemovedOrSaved,
    getManufacturersWarrantyLinks,
    getMasterPassConfig,
    getNonQPUableSkusInCart,
    getPromotions,
    getSelectedCheckoutFlow,
    getSkuToRequiredProductsMap,
    getSummary,
    hasWarrantyInCart,
} from "./selectors";
import {getProductServicesMap} from "../../store/selectors";
import EmptyCart from "./components/EmptyCart";
import GSPTermsAndConditions, {GSP_TC_ID} from "./components/TermsAndConditions";
import CheckoutButtons, {ContinueToCheckout} from "./components/CheckoutButtons";
import CheckoutFlowSelector, {QPU_IN_CART_STATE} from "./components/CheckoutFlowSelector";
import {getTermsFromStorage, setTermsOnStorage} from "./utils/termsChecked";
import * as styles from "./styles.css";
import LineItem from "./components/LineItem/LineItem";
import messages from "./translations/messages";
import VendorItem from "./components/VendorItem";
import {BBYCA} from "./constants/constants";
import {ProductList, ProductListProps} from "./components/ProductList";
import isCartEmpty from "../../utils/isCartEmpty";
import {ProductListLink} from "./components/ProductListLink";
import {SavedProduct} from "Decide/providers";

export interface StateProps {
    basketId: string;
    cartStatus?: CartStatus;
    cartErrorType?: string;
    cartHasWarranty: boolean;
    shippingStatus: BasketShippingStatus;
    cityName: string;
    config: ClientConfig & ServerConfig;
    features?: FeatureToggles;
    gsp?: GSPState;
    isKiosk: boolean;
    isLightWeightBasketEnabled: boolean;
    isQueueItEnabled: boolean;
    isRpuEnabled: boolean;
    language: Language;
    lineItems: CartLineItem[];
    location?: {
        query: {
            queueUri?: string;
            removeFromBasket?: string;
        };
    };
    manufacturersWarrantyLinks: TermsAndConditionsLink[];
    masterpassConfig: {
        allowedCardTypes: string;
        buttonImageUrl: string;
        checkoutId: string;
        isEnabled: boolean;
        jsLibraryUrl: string;
    };
    postalCode: string;
    promotionalBadges?: PromotionalBadges;
    promotions?: Promotion[];
    quebecLegalWarrantyUrl?: string;
    regionCode: Region;
    skuRequiredProductsMap: Map<
        string,
        {isLoading: boolean; requiredProducts: RequiredProduct[]; warranties: Warranty[]}
    >;
    summary: Summary;
    warrantyTermsAndConditionUrl?: string;
    isCartLoading: boolean;
    locationBeforeTransitions: RoutingState["locationBeforeTransitions"];
    isSaveForLaterEnabled: boolean;
    productListStatus: ProductListProps["status"];
    productListError: ProductListProps["error"];
    savedItems: ProductListProps["savedItems"];
    productServicesEnabled: boolean;
    selectedCheckoutFlow: CheckoutFlow;
    nonQPUableSkus: string[];
    checkoutButtonData: CheckoutButtonData;
    lineItemsNotRemovedOrSaved: CartLineItem[];
    getProductServicesMapping: (sku: string) => ProductService[];
    screenSize: ScreenSize;
}

export interface DispatchProps {
    analyticsPostalCodeUpdated: (postalCode: string) => void;
    changePostalCode: (postalCode: string) => void;
    dismissCartError: () => void;
    routingActions: RoutingActionCreators;
    basketActions: BasketActionCreators;
    gspActions: GSPActionCreators;
    productListActions: ProductListActionCreators;
    fetchRequiredProducts: (sku: string | null) => void;
    productRelatedProductsActions: ProductRelatedProductsActionCreators;
}

interface CartPageLocalState {
    itemsToRemove?: Array<{sku: string; quantity: number}>;
    pageLoaded: boolean;
    isTermsAccepted: boolean;
    failedTCPreCheck: boolean;
    warrantyTermsAndConditionUrl?: string;
    // errorCount is used to create keys that reset the GSP components local state
    errorCount: number;
}

const metaTags: Meta[] = [{name: "robots", content: "noindex"}];

export const removeTrailingSlash = (utlStr: string) => (utlStr ? utlStr.replace(/\/$/, "") : "");

const enum CheckoutButtonLocation {
    SIDEBAR = "Sidebar",
    MOBILE_HEADER = "MobileHeader"
}

export type CartPageProps = DispatchProps & StateProps & InjectedIntlProps;

export class CartPage extends React.Component<CartPageProps, CartPageLocalState> {
    private readonly productListRef: React.RefObject<HTMLElement>;

    constructor(props: CartPageProps, state: CartPageLocalState) {
        super(props, state);
        this.state = {
            itemsToRemove: this.getItemsToRemove(),
            pageLoaded: false,
            isTermsAccepted: getTermsFromStorage(),
            failedTCPreCheck: false,
            errorCount: 0,
        };
        this.productListRef = React.createRef<HTMLElement>();
    }

    public async componentDidMount() {
        const {locationBeforeTransitions, basketActions, productListActions, isSaveForLaterEnabled} = this.props;

        await basketActions.locate(true);

        if (locationBeforeTransitions) {
            await basketActions.syncBasketStateWithLocation(locationBeforeTransitions);
        }

        await basketActions.onLoad();

        if (isSaveForLaterEnabled) {
            productListActions.fetchProductList().then(() => basketActions.analyticsCartLoaded());
        } else {
            basketActions.analyticsCartLoaded();
        }

        this.setState({
            pageLoaded: true,
        });

        if (!!this.props.lineItems) {
            setGspTracking(this.props.lineItems);
        }
    }

    public componentWillUnmount() {
        const {basketActions, productListActions} = this.props;
        if (basketActions.cleanUp && typeof basketActions.cleanUp === "function") {
            basketActions.cleanUp();
        }
        productListActions.resetProductListState();
    }

    public componentDidUpdate(prevProps: CartPageProps) {
        // update the error count so GSP components can be reset
        if (prevProps.cartStatus !== CartStatus.FAILED && this.props.cartStatus === CartStatus.FAILED) {
            this.setState({errorCount: this.state.errorCount + 1});
        }

        if (!prevProps.isSaveForLaterEnabled && this.props.isSaveForLaterEnabled) {
            this.props.productListActions.fetchProductList();
        }
    }

    public render() {
        const {
            intl: {formatMessage},
            isSaveForLaterEnabled,
            lineItems,
            cartErrorType,
        } = this.props;

        const {pageLoaded} = this.state;
        const cartEmpty = isCartEmpty(lineItems);

        return (
            <>
                <HeadTags title={formatMessage(messages.title)} metaTags={metaTags} />
                <Header />
                <PageContent extraProps={{className: styles.pageContent}}>
                    <TitleHeader title={formatMessage(messages.heading)} className={styles.pageHeader} />
                    <Loader
                        loading={!pageLoaded}
                        loadingDisplay={
                            <div className={styles.pageLoader}>
                                <LoadingSpinner containerClass={styles.spinner} width="50px" />
                            </div>
                        }>
                        {cartEmpty && (
                            <section className={styles.emptyCart}>
                                <EmptyCart lineItems={lineItems} />
                            </section>
                        )}
                        {(isSaveForLaterEnabled || !cartEmpty) && (
                            <section
                                className={classname([styles.basketPage, classIf(styles.savedItemsFullRow, cartEmpty)])}
                                data-automation="basketpage-main">
                                <div className={styles.centerContainer}>
                                    <main>
                                        {this.renderErrors()}
                                        {this.getCartItems()}
                                        {this.getBasketAside()}
                                    </main>
                                    {this.getSavedForLaterSection()}
                                </div>
                            </section>
                        )}
                        <ErrorToaster
                            visible={(cartErrorType && cartErrorType !== "") || false}
                            close={this.props.dismissCartError}
                            message={this.getCartErrorMessage()}
                        />
                    </Loader>
                </PageContent>
                <Footer />
            </>
        );
    }

    private getSavedForLaterSection() {
        const {
            config,
            regionCode,
            isSaveForLaterEnabled,
            savedItems,
            productListActions,
            productListStatus,
            productListError,
        } = this.props;

        return (
            <FeatureToggle
                featureComponent={
                    <ProductList
                        status={productListStatus}
                        error={productListError}
                        displayEhfRegions={config.displayEhfRegions}
                        regionCode={regionCode}
                        savedItems={savedItems}
                        onMoveToCartButtonClick={productListActions.moveSavedItemToCart}
                        className={styles.productList}
                        onRemoveSavedItemButtonClick={productListActions.removeSavedItem}
                        ref={this.productListRef}
                    />
                }
                defaultComponent={null}
                isFeatureActive={isSaveForLaterEnabled}
            />
        );
    }

    private getCartItems() {
        if (isCartEmpty(this.props.lineItems)) {
            return null;
        }

        return (
            <form
                className={styles.cartItemsForm}
                action="/"
                id="cart"
                method="post"
                name="basket-form"
                onSubmit={(e) => e.preventDefault()}>
                {this.renderTotalSummary()}
                {this.getMobileHeaderCheckoutBlock()}
                <div className={styles.cartItems}>
                    <OrderPromotionItems items={this.props.promotions || []} />
                    <section>{this.renderLineItems()}</section>
                </div>
            </form>
        );
    }

    private getCheckoutButtons = (location: CheckoutButtonLocation) => {
        const {
            config,
            basketActions,
            intl: {locale},
            summary,
            basketId,
            isLightWeightBasketEnabled,
            isKiosk,
            selectedCheckoutFlow,
            checkoutButtonData,
            screenSize,
        } = this.props;

        const {appPaths} = config;
        const {customerIdentityExperienceService} = appPaths;
        const cieServiceUrl = removeTrailingSlash(customerIdentityExperienceService);
        const nothingQPUable = this.isNothingQPUable();

        const paymentOptionsBaseCondition = !isKiosk && !isLightWeightBasketEnabled && selectedCheckoutFlow === CheckoutFlow.getItShipped;
        let showAlternativePaymentOptions = paymentOptionsBaseCondition;

        // for the standard button on the sidebar we hide the paypal etc. buttons if we're on a mobile screen size
        if (location === CheckoutButtonLocation.SIDEBAR) {
            showAlternativePaymentOptions = paymentOptionsBaseCondition && !screenSize.is.extraSmall;
        }

        return (
            <CheckoutButtons
                checkoutUrl={checkoutButtonData.url}
                requireSignIn={checkoutButtonData.requireSignIn}
                lang={locale as Locale}
                basketId={basketId}
                totalPurchasePrice={summary.total}
                masterPassConfig={this.props.masterpassConfig}
                preCheck={this.verifyCheckedTC}
                paypalOnClick={basketActions.analyticsPaypalClicked}
                visaOnClick={basketActions.analyticsVisaClicked}
                masterpassOnClick={basketActions.analyticsMasterpassClicked}
                cieServiceUrl={cieServiceUrl}
                showAlternativePaymentOptions={showAlternativePaymentOptions}
                disabled={nothingQPUable && selectedCheckoutFlow === CheckoutFlow.pickUpAtAStore}
            />
        );
    };

    private getQpuInCartState() {
        if (this.isNothingQPUable()) {
            return QPU_IN_CART_STATE.NONE;
        } else if (this.props.nonQPUableSkus.length > 0) {
            return QPU_IN_CART_STATE.SOME;
        } else {
            return QPU_IN_CART_STATE.ALL;
        }
    }
    private getBasketAside() {
        const {
            basketActions,
            postalCode,
            cartHasWarranty,
            quebecLegalWarrantyUrl,
            warrantyTermsAndConditionUrl,
            manufacturersWarrantyLinks,
            summary,
            basketId,
            tax,
            isCartLoading,
            isKiosk,
            lineItems,
            selectedCheckoutFlow,
            screenSize,
        } = this.props;

        if (isCartEmpty(lineItems)) {
            return null;
        }
        const {isTermsAccepted, failedTCPreCheck} = this.state;
        const nothingQPUable = this.isNothingQPUable();

        // change EHF for New Brunswick
        if (postalCode?.toUpperCase().startsWith("E") && summary?.ehf) {
            summary.subtotal += summary.ehf;
            summary.ehf = 0;
        }

        return (
            <section className={styles.basketAside} data-automation="basket-aside">
                {this.renderAllNonPurchasableHeader()}
                <section className={styles.enterPcSection} data-automation="enter-pc-section">
                    <EnterPostalCode postalCode={postalCode} changePostalCode={this.changePostalCode} />
                </section>
                {!this.isAllNonPurchasable() && (
                    <CostSummary
                        estimated={true}
                        loading={isCartLoading}
                        id={basketId}
                        tax={tax}
                        totalEHF={summary.ehf}
                        totalProductPrice={summary.subtotal}
                        totalPurchasePrice={summary.total}
                        totalQuantity={summary.quantity}
                        totalSavings={summary.savings}
                        totalShippingPrice={summary.shipping}
                        totalTaxes={summary.taxes}>
                        {cartHasWarranty && (
                            <GSPTermsAndConditions
                                className={styles.termsAndConditionsSection}
                                isTermsAccepted={isTermsAccepted}
                                shouldHighlightTerms={failedTCPreCheck}
                                onTermsChecked={this.onTermsChecked}
                                links={[
                                    {
                                        href: warrantyTermsAndConditionUrl || "",
                                        dataAutomation: "geeksquad-warranty-terms-link",
                                        text: <FormattedMessage {...tcMessages.geeksquad} />,
                                        openNewTab: true,
                                    },
                                    {
                                        href: quebecLegalWarrantyUrl || "",
                                        dataAutomation: "geeksquad-legal-warranty-quebec-link",
                                        text: <FormattedMessage {...tcMessages.quebec} />,
                                        openNewTab: true,
                                    },
                                    ...manufacturersWarrantyLinks,
                                ]}
                            />
                        )}

                        {!screenSize.is.extraSmall && (
                            <CheckoutFlowSelector
                                className={styles.sidebar}
                                selected={selectedCheckoutFlow}
                                pickUpAtStoreDisabled={isKiosk || nothingQPUable}
                                onChange={basketActions.updateCheckoutFlow}
                                qpuInCartState={this.getQpuInCartState()}
                                numberOfItemsInCart={this.getNumberOfItemsInCart()}
                            />
                        )}
                        {this.getCheckoutButtons(CheckoutButtonLocation.SIDEBAR)}
                    </CostSummary>
                )}
            </section>
        );
    }

    /*
        This is used primarily for singular and plural copy writing
    */
    private getNumberOfItemsInCart(): number {
        const { lineItemsNotRemovedOrSaved } = this.props;
        return lineItemsNotRemovedOrSaved.length === 1 ?
            lineItemsNotRemovedOrSaved[0].summary.quantity :
            lineItemsNotRemovedOrSaved.length;
    }

    private isNothingQPUable = () => {
        return this.props.nonQPUableSkus.length === this.props.lineItemsNotRemovedOrSaved.length;
    };

    private getMobileHeaderCheckoutBlock = () => {
        const {screenSize, selectedCheckoutFlow, isKiosk, basketActions} = this.props;

        if (!screenSize.is.extraSmall) {
            return null;
        }
        const nothingQPUable = this.isNothingQPUable();

        return (
            <div className={styles.mobileHeaderCheckout}>
                <CheckoutFlowSelector
                    className={styles.checkoutFlowMobile}
                    selected={selectedCheckoutFlow}
                    pickUpAtStoreDisabled={isKiosk || nothingQPUable}
                    onChange={basketActions.updateCheckoutFlow}
                    qpuInCartState={this.getQpuInCartState()}
                    numberOfItemsInCart={this.getNumberOfItemsInCart()}
                />
                {this.getCheckoutButtons(CheckoutButtonLocation.MOBILE_HEADER)}
            </div>
        );
    };

    private onTermsChecked = () => {
        const newTCState = !this.state.isTermsAccepted;
        this.setState({
            isTermsAccepted: newTCState,
            failedTCPreCheck: false,
        });
        setTermsOnStorage(newTCState);
    };

    private getItemsToRemove = () => {
        let itemsToRemove: Array<{sku: string; quantity: number}> = [];
        if (this.props.location?.query?.removeFromBasket) {
            const {removeFromBasket} = this.props.location.query;

            itemsToRemove = removeFromBasket
                .split(";")
                .filter((lineItem) => lineItem)
                .map((lineItem) => {
                    const [sku, quantity] = lineItem.split(",");
                    return {
                        sku,
                        quantity: parseInt(quantity, 10),
                    };
                });
        }
        return itemsToRemove;
    };

    private changePostalCode = async (postalCode: string) => {
        const {analyticsPostalCodeUpdated, changePostalCode, isSaveForLaterEnabled, productListActions} = this.props;

        analyticsPostalCodeUpdated(postalCode);

        if (changePostalCode && typeof changePostalCode === "function") {
            await changePostalCode(postalCode);
            if (isSaveForLaterEnabled) {
                productListActions.fetchProductList();
            }
        }
    };

    private renderErrors = () => {
        if (isCartEmpty(this.props.lineItems)) {
            return null;
        }

        const {intl} = this.props;
        if (location.search && location.search.indexOf("paypalError=true") > -1) {
            return (
                <div className={styles.cartItems}>
                    <GlobalWarningMessage message={intl.formatMessage(messages.paypalError)} />
                </div>
            );
        }
        return;
    };

    private renderTotalSummary = () => {
        if (this.isAllNonPurchasable()) {
            return;
        }
        const {
            summary,
            intl: {formatMessage, locale},
            isSaveForLaterEnabled,
            savedItems = [],
        } = this.props;
        const totalVisibleSavedItems = savedItems.filter((item: SavedProduct) => !item.removed && !item.movedToCart)
            .length;

        return (
            <div className={styles.cartSummary}>
                <section className={styles.totalSummary}>
                    <table>
                        <tbody>
                            <tr>
                                <th>{formatMessage(messages.estimatedTotal)}:</th>
                                <td>
                                    <small>
                                        <FormattedMessage {...messages.items} values={{quantity: summary.quantity}} />
                                    </small>
                                    {formatPrice(summary.total, locale)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <FeatureToggle
                        featureComponent={
                            <ProductListLink productListRef={this.productListRef} total={totalVisibleSavedItems} />
                        }
                        defaultComponent={null}
                        isFeatureActive={isSaveForLaterEnabled}
                    />
                </section>
            </div>
        );
    };

    private isAllNonPurchasable = (): boolean => {
        if (!this.props.summary.quantity) {
            return true;
        }
        return false;
    };

    private renderAllNonPurchasableHeader = () => {
        if (!this.isAllNonPurchasable()) {
            return;
        }
        const {shippingStatus} = this.props;
        const {header, body} = this.getCartMessageHeaderAndBody(shippingStatus);

        return (
            <div className={styles.outOfStock} data-automation="out-of-stock">
                <div className="text">
                    <h2>{header}</h2>
                    <p>{body}</p>
                </div>
                <Button href="/" className={styles.continue} appearance="secondary">
                    <div data-automation="continue-shopping">
                        <FormattedMessage {...messages.continueShopping} />
                    </div>
                </Button>
            </div>
        );
    };

    private getCartMessageHeaderAndBody = (status: BasketShippingStatus): {header?: string; body?: string} => {
        let header: string | undefined;
        let body: string | undefined;

        const {
            regionCode,
            intl: {formatMessage},
        } = this.props;

        const currentRegionName = getEnRegionName(regionCode);

        if (status === BasketShippingStatus.EverythingOutOfStockInRegion) {
            header = formatMessage(messages.everythingOutOfStockInRegion, {
                region: currentRegionName,
            });
            body = formatMessage(messages.everythingOutOfStockInRegionBody);
        } else if (status === BasketShippingStatus.EverythingRegionRestricted) {
            header = formatMessage(messages.everythingRegionRestricted, {
                region: currentRegionName,
            });
            body = formatMessage(messages.everythingRegionRestrictedBody);
        } else if (status === BasketShippingStatus.EverythingSoldOutOnline) {
            header = formatMessage(messages.everythingIsOutOfStock);
            body = formatMessage(messages.whyNotAddSomething);
        } else if (status === BasketShippingStatus.MixOfNonPurchasable) {
            header = formatMessage(messages.mixOfNonPurchasable);
            body = formatMessage(messages.mixOfNonPurchasableBody);
        }

        return {header, body};
    };

    private verifyCheckedTC = (e: React.MouseEvent<HTMLAnchorElement>): void => {
        const {cartHasWarranty} = this.props;
        if (cartHasWarranty && !getTermsFromStorage()) {
            e.preventDefault();
            e.stopPropagation();
            scroller.scrollTo(GSP_TC_ID, {
                delay: 100,
                duration: 1000,
                smooth: true,
            });
            tracker.dispatchEvent({
                action: "View",
                category: "Warranty",
                label: "Cart Error",
            });
            this.setState({
                failedTCPreCheck: true,
            });
        } else {
            if (this.props.lineItems) {
                trackGsp(this.props.lineItems);
            }
        }
    };

    private getCartErrorMessage = (): string => {
        const {
            intl: {formatMessage},
            cartErrorType,
        } = this.props;

        const translation = cartErrorType && messages[cartErrorType];

        return translation ? formatMessage(translation) : formatMessage(messages.errorFallbackMessage);
    };

    private getLineItemSellerId(lineItem: CartLineItem) {
        return lineItem.product.offer.seller.id;
    }

    private makeLineItemComponent = (item: CartLineItem) => {
        const {errorCount} = this.state;
        const {
            features,
            promotionalBadges,
            warrantyTermsAndConditionUrl,
            config,
            regionCode,
            gspActions,
            basketActions,
            fetchRequiredProducts,
            isLightWeightBasketEnabled,
            isRpuEnabled,
            cartErrorType,
            isCartLoading,
            gsp,
            productServicesEnabled,
            getProductServicesMapping,
            productRelatedProductsActions,
        } = this.props;
        const warrantyOptions = this.getGspPlansForSku(item);
        const isRequiredProductsLoading = this.getRequiredProductsLoading(item);
        const requiredProducts = this.getRequiredProducts(item);
        const benefitsMessage = gsp?.[item.product.sku]?.benefitsMessage;

        return (
            <li key={`sku${item.id}`}>
                <LineItem
                    errorCount={errorCount}
                    id={item.id}
                    type={item.type}
                    product={item.product}
                    summary={item.summary}
                    childLineItems={item.childLineItems}
                    promotions={item.promotions}
                    shippingStatus={get(item, "availability.shipping.status")}
                    features={features}
                    loading={isCartLoading}
                    promotionalBadges={promotionalBadges}
                    selectedWarranty={item.selectedWarranty}
                    warrantyOptions={warrantyOptions}
                    warrantyTermsAndConditionUrl={warrantyTermsAndConditionUrl || ""}
                    availability={item.availability}
                    ehfRegions={config.displayEhfRegions}
                    errorType={cartErrorType}
                    regionCode={regionCode}
                    requiredProducts={requiredProducts}
                    isRequiredProductsLoading={isRequiredProductsLoading}
                    benefitsMessage={benefitsMessage}
                    isRpuEnabled={isRpuEnabled}
                    isLightweightBasketEnabled={isLightWeightBasketEnabled}
                    fetchWarrantyBenefits={gspActions.fetchWarrantyBenefits}
                    updateWarrantyForSkuInCart={basketActions.updateWarrantyForSku}
                    onRemoveChildItem={basketActions.removeChildItem}
                    fetchRequiredProducts={fetchRequiredProducts}
                    onRemoveItem={basketActions.removeItem}
                    onUpdateItemQuantity={basketActions.updateLineItemQuantity}
                    removed={item.removed}
                    onSaveItemForLater={basketActions.saveItemForLater}
                    savedForLater={item.savedForLater}
                    saveForLaterError={item.saveForLaterError}
                    productServicesEnabled={productServicesEnabled}
                    productServices={getProductServicesMapping?.(item.product.sku)}
                    getRelatedServices={productRelatedProductsActions?.getRelatedServices}
                    updateServicesForSku={basketActions.updateServicesForSku}
                />
            </li>
        );
    };

    private getSellerNameFromLineItems = (lineItems: CartLineItem[]): string => {
        return get(lineItems, "[0].product.offer.seller.name", "");
    };

    private renderLineItems = (): React.ReactNode => {
        const {lineItems} = this.props;

        const groupedBySellerIds = groupBy<CartLineItem>(lineItems, this.getLineItemSellerId);

        const lineItemsComponents: React.ReactNode[] = [];

        const getVendor = ({key, component}: {key: string; component: React.ReactNode}): React.ReactNode => (
            <li key={key} className={styles.vendorItem}>
                {component}
            </li>
        );

        // add bbyca first
        if (groupedBySellerIds && groupedBySellerIds.bbyca) {
            lineItemsComponents.push(
                getVendor({
                    key: "seller-bbyca",
                    component: (
                        <VendorItem
                            sellerId={BBYCA}
                            sellerName={this.getSellerNameFromLineItems(groupedBySellerIds.bbyca)}
                            shouldDisplayHeader={!this.isShipmentWithOnlyRemovedItems(groupedBySellerIds.bbyca)}
                            lineItems={groupedBySellerIds.bbyca.map(this.makeLineItemComponent)}
                        />
                    ),
                }),
            );
        }

        // add other sellers
        Object.keys(groupedBySellerIds)
            .filter((sellerId) => sellerId !== BBYCA)
            .forEach((sellerId) => {
                lineItemsComponents.push(
                    getVendor({
                        key: `seller-${sellerId}`,
                        component: (
                            <VendorItem
                                sellerId={sellerId}
                                sellerName={this.getSellerNameFromLineItems(groupedBySellerIds[sellerId])}
                                shouldDisplayHeader={!this.isShipmentWithOnlyRemovedItems(groupedBySellerIds[sellerId])}
                                lineItems={groupedBySellerIds[sellerId].map(this.makeLineItemComponent)}
                            />
                        ),
                    }),
                );
            });

        return <ul className={styles.lineItemList}>{lineItemsComponents}</ul>;
    };

    private isShipmentWithOnlyRemovedItems = (lineItems: CartLineItem[]): boolean => {
        return lineItems.filter((li) => !li.removed && !li.savedForLater).length < 1;
    };

    private getGspPlansForSku = (lineItem: CartLineItem) => {
        let gspPlans: Warranty[] = [];
        const requiredParts = this.props.skuRequiredProductsMap.get(lineItem.product.sku);
        const requiredPartsWarranties = requiredParts ? requiredParts.warranties : null;

        if (lineItem && lineItem.product.availableServicePlans) {
            lineItem.product.availableServicePlans.forEach((warranty) => {
                const gspType = warranty.servicePlanType === ServicePlanType.PSP ? WarrantyType.PSP : WarrantyType.PRP;
                const data: Warranty = {
                    parentSku: lineItem.product.sku,
                    regularPrice: warranty.offer.regularPrice,
                    sku: warranty.sku,
                    subType: "", // this is not used
                    termMonths: warranty.termMonths,
                    title: warranty.name,
                    type: gspType,
                };
                gspPlans.push(data);
            });
        } else if (requiredPartsWarranties) {
            gspPlans = requiredPartsWarranties;
        }

        return gspPlans;
    };

    private getRequiredProductsLoading = (lineItem: CartLineItem) => {
        const skuRequiredProducts = this.props.skuRequiredProductsMap.get(lineItem.product.sku);
        return !!skuRequiredProducts && skuRequiredProducts.isLoading;
    };

    private getRequiredProducts = (lineItem: CartLineItem) => {
        const skuRequiredProducts = this.props.skuRequiredProductsMap.get(lineItem.product.sku);
        return (skuRequiredProducts && skuRequiredProducts.requiredProducts) || [];
    };
}

const mapStateToProps = (state: State): StateProps => ({
    isCartLoading: getIsLoading(state),
    cartStatus: getCartPageCartStatus(state),
    cartErrorType: getCartPageErrorType(state),
    summary: getSummary(state),
    basketId: getBasketId(state),
    cartHasWarranty: hasWarrantyInCart(state),
    cityName: getUserShippingLocationCity(state),
    config: getConfig(state),
    masterpassConfig: getMasterPassConfig(state),
    language: getIntlLanguage(state),
    postalCode: getUserShippingLocationPostalCode(state),
    quebecLegalWarrantyUrl: getQuebecLegalWarrantyUrl(state),
    regionCode: getUserShippingLocationRegionCode(state),
    locationBeforeTransitions: getLocationBeforeTransitions(state),
    features: getConfigFeatures(state),
    promotionalBadges: getPromotionalBadges(state),
    manufacturersWarrantyLinks: getManufacturersWarrantyLinks(state),
    lineItems: getLineItems(state),
    warrantyTermsAndConditionUrl: getTermsAndConditionsUrl(state),
    skuRequiredProductsMap: getSkuToRequiredProductsMap(state),
    isLightWeightBasketEnabled: isLightWeightBasketEnabledSelector(state),
    isQueueItEnabled: isQueueItEnabledSelector(state),
    isRpuEnabled: isRpuEnabledSelector(state),
    promotions: getPromotions(state),
    gsp: getGspState(state),
    shippingStatus: getCartShippingStatus(state),
    isSaveForLaterEnabled: getFeatureToggle(FEATURE_TOGGLES.saveForLater)(state) as boolean,
    savedItems: getProductListLineItems(state),
    productListStatus: getProductListStatus(state),
    productListError: getProductListError(state),
    isKiosk: isKioskEnv(state),
    productServicesEnabled: getFeatureToggle(FEATURE_TOGGLES.productServicesEnabled)(state) as boolean,
    selectedCheckoutFlow: getSelectedCheckoutFlow(state),
    nonQPUableSkus: getNonQPUableSkusInCart(state),
    checkoutButtonData: getCheckoutButtonData(state),
    lineItemsNotRemovedOrSaved: getLineItemsNotRemovedOrSaved(state),
    getProductServicesMapping: (sku: string) => getProductServicesMap(state, sku, true),
    screenSize: getScreenSize(state),
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
    analyticsPostalCodeUpdated: (postalCode: string) => dispatch(analyticsPostalCodeUpdatedAction(postalCode)),
    changePostalCode: async (postalCode: string) => dispatch(basketActionCreators.changePostalCode(postalCode)),
    dismissCartError: () => dispatch(clearCartFailureCode()),
    routingActions: bindActionCreators(routingActionCreators, dispatch),
    basketActions: bindActionCreators(basketActionCreators, dispatch),
    gspActions: bindActionCreators(gspActionCreators, dispatch),
    productListActions: bindActionCreators(productListActionCreators, dispatch),
    fetchRequiredProducts: (sku: string | null) => dispatch(cachedFetchSimpleRequiredProducts(sku)),
    productRelatedProductsActions: bindActionCreators(productRelatedProductsActionCreators, dispatch),
});

export default connect<StateProps, DispatchProps>(
    mapStateToProps,
    mapDispatchToProps,
)(injectIntl<StateProps & DispatchProps>(CartPage));
