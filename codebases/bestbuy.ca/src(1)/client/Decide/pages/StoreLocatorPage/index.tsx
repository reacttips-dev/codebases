import * as React from "react";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import Divider from "@material-ui/core/Divider";
import MyLocation from "@material-ui/icons/MyLocation";
import {Key} from "@bbyca/apex-components";
import {IBrowser as ScreenSize} from "redux-responsive";
import {Button} from "@bbyca/bbyca-components";
import {tracker} from "@bbyca/ecomm-utilities";
import {Col, Row} from "@bbyca/ecomm-components";
import {FormattedMessage} from "react-intl";
import {RouteProps} from "react-router";

import Header from "components/Header";
import HeadTags, {Meta, Props as HeadTagProps } from "components/HeadTags";
import PageContent from "components/PageContent";
import Link from "components/Link";
import {State} from "store";
import getLogger from "common/logging/getLogger";
import {
    productActionCreators,
    errorActionCreators,
    ProductActionCreators,
    ErrorActionCreators,
    userActionCreators,
    UserActionCreators,
    storeMessageActionCreators,
    StoreMessageActionCreators,
    storesStatusActionCreators,
    StoresStatusActionCreators,
    availabilityActionCreators,
    AvailabilityActionCreators,
    storesActionCreators,
    StoresActionCreators,
} from "actions";
import {
    DetailedProduct as Product,
    AvailabilityReduxStore,
    PickupStore,
    RetailStoreStatus,
    StoreMessages,
} from "models";
import {RoutingState} from "reducers";
import Footer from "components/Footer";
import LoadMore from "components/ProductListing/LoadMore";
import {RpuPickUpLinks} from "config";

import {ProductDetailsBrief} from "../../components/ProductDetailsBrief";
import messages from "./translations/messages";
import {ProductDetailsBriefPlaceHolder} from "./components/ProductDetailsBriefPlaceholder";
import {StoreResultsPlaceholder} from "./components/StoreResultsPlaceholder";
import * as styles from "./style.css";
import StoresListItem from "./components/StoresListItem";
import {getSortedPickupStores} from "Decide/store/selectors/productSelectors";
import {getScreenSize} from "store/selectors";

export interface StateProps {
    availability: AvailabilityReduxStore;
    sortedPickupStores: PickupStore[];
    quickAndEasyPickupHelpUrl: string;
    loadingProduct: boolean;
    hasMatchingProduct: boolean;
    language: Language;
    productName: string;
    product: Product;
    routing: RoutingState;
    user: any;
    locale?: string;
    storesStatus: RetailStoreStatus;
    storeMessages: StoreMessages;
    rpuUrl?: RpuPickUpLinks;
    storeLocatorUrl?: string;
    screenSize: ScreenSize;
}

interface OwnState {
    postalCode: string;
    postalCodeValid: boolean;
    storesShown: number;
}

export interface OwnProps {
    location: object;
    params: any;
    handleClose: () => void;
    isOpen: boolean;
    loadingStores: boolean;
    postalCode: string;
    stores?: PickupStore[];
}

export interface DispatchProps {
    productActions: ProductActionCreators;
    errorActions: ErrorActionCreators;
    userActions: UserActionCreators;
    storeMessageActions: StoreMessageActionCreators;
    storesStatusActions: StoresStatusActionCreators;
    availabilityActions: AvailabilityActionCreators;
    storesActions: StoresActionCreators;
}

const metaTags: Meta[] = [{name: "robots", content: "noindex,nofollow"}];

export class StoreLocatorPage extends React.Component<
    StateProps & OwnProps & DispatchProps & InjectedIntlProps & RouteProps,
    OwnState
> {
    private FORM_REF;
    private POSTAL_CODE_MAX_LENGTH = 7;
    private STORES_PAGE_SIZE = 10;

    constructor(props) {
        super(props);

        this.state = {
            postalCode: "",
            postalCodeValid: true,
            storesShown: this.STORES_PAGE_SIZE,
        };
    }

    public async componentDidMount() {
        await this.props.storesActions.syncProductStoreLocatorStateWithLocation(this.props.location);
        await this.props.userActions.getLocation(true, this.props.user?.shippingLocation?.postalCode);
        await this.props.availabilityActions.getProductAvailabilitySellerCount();
        this.props.storeMessageActions.getStoreMessages();
        this.props.storesStatusActions.getStoresStatus();
        this.trackPageLoad();
    }

    private submitPostalCode = async (): Promise<void> => {
        this.setState({storesShown: this.STORES_PAGE_SIZE});
        await this.props.userActions.getLocation(true, this.state.postalCode);
        this.props.storesActions.updateStores(this.props.product.sku);

        tracker.dispatchEvent({
            action: "Submit",
            category: "PDP",
            label: "Postal code form in update location modal",
        });
    };

    private handlePostalCodeInput = (event: React.FormEvent<HTMLInputElement>): void => {
        this.setState({postalCode: event.currentTarget.value});
    };

    private validatePostalCode = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        const {postalCode} = this.state;
        const postalCodeRegex = new RegExp(/^[a-zA-Z]\d[a-zA-Z] ?\d[a-zA-Z]\d$/i);
        const postalCodeValid = postalCodeRegex.test(postalCode) || postalCode === "";
        this.setState({postalCodeValid}, postalCodeValid ? this.submitPostalCode : null);
    };

    // tslint:disable-next-line:member-ordering
    public render() {
        const {availability, params, productName, product} = this.props;

        let headTagProps: HeadTagProps = {
            metaTags
        };

        if (this.props.productName && !this.props.loadingStores) {
            headTagProps.title = this.props.intl.formatMessage(messages.title, {name: productName});
        }

        return (
            <>
                <HeadTags {...headTagProps} />
                <div>
                    <Header />
                    <PageContent>
                        <div className={styles.storeLocatorContainer}>
                            <div className={styles.storeLocatorWrapper}>
                                <>
                                    <div className={styles.backLinkWrapper}>
                                        <Link
                                            to="product"
                                            params={[params.seoName, params.sku]}
                                            className={styles.link}>
                                            <KeyboardArrowLeft className={styles.backArrow} />
                                            <span property="name">{this.props.intl.formatMessage(messages.back)}</span>
                                        </Link>
                                    </div>
                                    <Divider className={styles.breadcrumbDivider} />
                                </>
                                <>
                                    <div className={styles.storeLocatorHeader}>
                                        <header className={styles.header}>
                                            <FormattedMessage {...messages.StoreAvailabilityHeader} tagName="h1" />
                                        </header>
                                        {product && product.sku ? (
                                            <Link
                                                to="product"
                                                params={[params.seoName, params.sku]}
                                                className={styles.productDetailsBriefLink}>
                                                <ProductDetailsBrief truncateMaxLines={2} />
                                            </Link>
                                        ) : (
                                            <ProductDetailsBriefPlaceHolder />
                                        )}
                                    </div>
                                    <Divider className={styles.divider} />
                                    <div className={styles.topContainer}>
                                        <div className={styles.subHeader}>
                                            <FormattedMessage {...messages.UpdateLocationHeader} tagName="h2" />
                                            <FormattedMessage {...messages.UpdateLocationDescription} />
                                        </div>
                                        <form onSubmit={this.validatePostalCode} ref={(form) => (this.FORM_REF = form)}>
                                            <Row className={styles.fluidRow}>
                                                <Col className={styles.colOverrides} xs={9} md={8}>
                                                    <div className={styles.inputContainer}>
                                                        <input
                                                            className={`${styles.postalCodeInput} ${
                                                                !this.state.postalCodeValid ? styles.inputError : ""
                                                            }`}
                                                            data-automation="update-location-input"
                                                            maxLength={this.POSTAL_CODE_MAX_LENGTH}
                                                            name="postalCode"
                                                            onChange={this.handlePostalCodeInput}
                                                            placeholder={this.props.user.shippingLocation.postalCode}
                                                            type="text"
                                                        />
                                                        <Button
                                                            className={`${styles.updateButton}`}
                                                            data-automation="update-location-submit"
                                                            type="submit">
                                                            <FormattedMessage {...messages.UpdateLocationButton} />
                                                        </Button>
                                                    </div>
                                                </Col>
                                                <Col className={styles.colOverrides} xs={1}>
                                                    <button
                                                        className={`${styles.geoLocateButton} ${
                                                            !this.canGeoLocate() ? styles.disabled : ""
                                                        }`}
                                                        data-automation="find-my-location-button"
                                                        onClick={this.canGeoLocate() ? this.geoLocate : null}
                                                        type="button">
                                                        <MyLocation />
                                                    </button>
                                                </Col>
                                            </Row>
                                            {!this.state.postalCodeValid && (
                                                <div
                                                    className={`${styles.postalCodeErrorMessage}`}
                                                    data-automation="update-location-error">
                                                    <span className={styles.postalCodeErrorMessageText}>
                                                        <FormattedMessage {...messages.UpdateLocationPostalCodeError} />
                                                    </span>
                                                </div>
                                            )}
                                        </form>
                                    </div>
                                    <Divider className={styles.divider} />
                                    <div className={styles.storeListContainer}>
                                        {!availability ? <StoreResultsPlaceholder /> : this.renderStoreResults()}
                                    </div>
                                </>
                            </div>
                        </div>
                    </PageContent>
                    <Footer />
                </div>
            </>
        );
    }

    private geoLocate = (): void => {
        this.setState(
            {
                postalCode: "",
                postalCodeValid: true,
            },
            this.updateStores,
        );

        if (this.FORM_REF) {
            this.FORM_REF.reset();
        }

        tracker.dispatchEvent({
            action: "Click",
            category: "PDP",
            label: "Geolocation button in update location modal",
        });
    };

    private buildStoreLocatorUrl = (id) => {
        return this.props.storeLocatorUrl
            .replace("{locale}", this.props.locale.toLowerCase())
            .replace("{locationId}", id);
    };

    private renderStoreResults = () => {
        const {language, quickAndEasyPickupHelpUrl, sortedPickupStores} = this.props;
        if (!sortedPickupStores.length) {
            return this.renderNoStoreMessage();
        }
        const trimmedStoresList = sortedPickupStores.slice(0, this.state.storesShown);
        const renderLoadMore = this.state.storesShown < sortedPickupStores.length;

        const storeMessages = this.props.storeMessages && this.props.storeMessages.messages;

        return (
            <div>
                <h2
                    className={styles.nearbyLocations}
                    data-automation="stores-num-container"
                    data-automation-total-stores={sortedPickupStores.length}>
                    {this.props.intl.formatMessage(messages.AvailableStoresNearPostalCode, {
                        numStores: trimmedStoresList.length,
                        totalStores: sortedPickupStores.length,
                        postalCode: this.props.user.shippingLocation.postalCode,
                    })}
                </h2>

                <div className={`${styles.storesList} ${!!renderLoadMore && styles.hasMoreStores}`}>
                    {trimmedStoresList.map((store: PickupStore) => {
                        const storeMessage =
                            storeMessages &&
                            storeMessages[store.locationId] &&
                            storeMessages[store.locationId][language];

                        return (
                            <StoresListItem
                                language={language}
                                rpuUrl={this.props.rpuUrl}
                                storesStatus={this.props.storesStatus}
                                store={store}
                                key={store.locationId}
                                onReserveButtonClicked={() => this.onReserveInStoreButtonClick(store.locationId)}
                                screenSize={this.props.screenSize}
                                storeLocatorUrl={this.buildStoreLocatorUrl(store.locationId)}
                                quickAndEasyPickupHelpUrl={quickAndEasyPickupHelpUrl}
                                storeMessage={storeMessage}
                            />
                        );
                    })}
                </div>
                {!!renderLoadMore && (
                    <div data-automation="load-more-stores-button-container">
                        <LoadMore
                            appearance="tertiary"
                            linkKey={"stores" as Key}
                            labelText={this.props.intl.formatMessage(messages.SeeMoreStores)}
                            onLoadMoreButtonTap={this.seeMoreStores}
                            shouldRender={renderLoadMore}
                            screenSize={this.props.screenSize.lessThan.small}
                            hideDivider={true}
                        />
                    </div>
                )}
            </div>
        );
    };

    private renderNoStoreMessage = () => (
        <div className={`${styles.errorMessage}`} data-automation="no-stores-message">
            <FormattedMessage {...messages.UpdateLocationNoStoresFoundForPostalCode} />
        </div>
    );

    private updateStores = async () => {
        this.setState({storesShown: this.STORES_PAGE_SIZE});
        await this.props.productActions.setGeoLocation(true);
        this.props.storesActions.updateStores(this.props.product.sku);
    };

    private onReserveInStoreButtonClick = async (storeId: string) => {
        try {
            await this.props.productActions.reserveInStore(
                {items: [{sku: this.props.product.sku, quantity: 1}], storeId},
                {rpuFrom: "Store Locator Page"},
            );
        } catch (error) {
            getLogger().error(error);
        }
    };

    private trackPageLoad = () => this.props.storesActions.trackStoreLocatorPageView();

    private canGeoLocate = () => {
        const preference = this.props.user.preference;
        return !preference || (preference && preference.geoLocation !== "deny");
    };

    private seeMoreStores = () => {
        this.setState({
            storesShown: this.state.storesShown + this.STORES_PAGE_SIZE,
        });
    };
}

function mapStateToProps(state: State, props: OwnProps) {
    const product = state.product.product;
    return {
        availability: state.product.availability,
        sortedPickupStores: getSortedPickupStores(state),
        quickAndEasyPickupHelpUrl:
            state.config.dataSources.quickAndEasyPickupHelpUrl &&
            state.config.dataSources.quickAndEasyPickupHelpUrl[state.intl.language],
        language: state.intl.language,
        loadingProduct: state.product.loadingProduct,
        hasMatchingProduct: (product && product.sku) === props.params.sku,
        productName: product && product.name,
        product,
        routing: state.routing,
        user: state.user,
        rpuUrl: state.config.rpu,
        storesStatus: state.storesStatus,
        storeMessages: state.storeMessages,
        storeLocatorUrl: state.config.dataSources.storeLocatorUrl,
        locale: state.intl.locale,
        screenSize: getScreenSize(state)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        productActions: bindActionCreators(productActionCreators, dispatch),
        errorActions: bindActionCreators(errorActionCreators, dispatch),
        userActions: bindActionCreators(userActionCreators, dispatch),
        storeMessageActions: bindActionCreators(storeMessageActionCreators, dispatch),
        storesStatusActions: bindActionCreators(storesStatusActionCreators, dispatch),
        availabilityActions: bindActionCreators(availabilityActionCreators, dispatch),
        storesActions: bindActionCreators(storesActionCreators, dispatch),
    };
}

export default connect<StateProps, DispatchProps, OwnProps, RouteProps>(
    mapStateToProps,
    mapDispatchToProps,
)(injectIntl(StoreLocatorPage));
