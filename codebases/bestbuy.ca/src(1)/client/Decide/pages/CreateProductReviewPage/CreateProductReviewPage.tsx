import {Location} from "history";
import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {bindActionCreators} from "redux";
import {InjectedIntlProps, injectIntl, InjectedIntl} from "react-intl";
import Divider from "@material-ui/core/Divider";
import {State} from "store";
import {BreadcrumbList} from "components/BreadcrumbList";
import BreadcrumbPlaceholder from "../../components/BreadcrumbPlaceholder";
import ReviewedProduct from "./components/ReviewedProduct";
import {CmsEnvironment, getCmsEnvironment} from "../../../utils/environment";
import {sendReviewAnalytics} from "../ProductDetailPage/utils";
import {convertLocaleToBazaarVoiceLocale} from "utils/productContentCollection";
import {classname} from "utils/classname";
import {RoutingActionCreators as RoutingActions, routingActionCreators as routingActions} from "actions/routingActions";
import {userActionCreators as userActions, UserActionCreators as UserActions} from "actions/userActions";
import {
    productActionCreators as productActions,
    ProductActionCreators as ProductActions,
} from "../../actions/productActions";
import {searchActionCreators as searchActions, SearchActionCreators as SearchActions} from "actions/searchActions";
import {errorActionCreators as errorActions} from "actions/errorActions";
import Header from "components/Header";
import PageContent from "components/PageContent";
import {RoutingState, BazaarVoiceJSState} from "reducers";
import {User, DetailedProduct as Product, BreadcrumbListItem} from "models";
import messages from "./translations/messages";
import {Category} from "models";
import {IBrowser as ScreenSize} from "redux-responsive";
import * as styles from "./style.css";
import {RouteComponentProps} from "react-router";
import {
    ReviewFormWithIntl,
    FormError,
    VerifiedPurchaserQueryParams,
    defaultVerifiedPurchaserQueryParams,
} from "./components/ReviewForm";
import ReviewSubmitConfirmation from "./components/ReviewSubmitConfirmation";
import {CreateReviewPageDisplayModes} from ".";
import Footer from "components/Footer";
import DeviceFingerprint from "../../components/DeviceFingerprint";
import {BazaarVoice, FeatureToggles} from "config";
import HeadTags from "components/HeadTags";
import {Error} from "components/Error";
import {Error as ErrorType, StatusCode} from "errors";
import {parseQueryString} from "client/utils/queryString";
import {createBreadcrumbList} from "utils/builders/breadcrumbBuilder/createBreadcrumbList";
import {bazaarVoiceJSActionCreators, BazaarVoiceJSActionCreators} from "actions";
import {getScreenSize} from "store/selectors";

export interface StateProps extends Pick<FeatureToggles, "bazaarvoiceSellerReviewsEnabled"> {
    language: Language;
    locale: Locale;
    location: Location;
    user: User;
    product: Product;
    category: Category;
    screenSize: ScreenSize;
    env: CmsEnvironment;
    routing: RoutingState;
    bazaarVoiceEnabled: boolean;
    bazaarvoiceConfig?: BazaarVoice;
    bazaarVoiceJS: BazaarVoiceJSState;
}

export interface DispatchProps {
    routingActions: RoutingActions;
    userActions: UserActions;
    productActions: ProductActions;
    searchActions: SearchActions;
    bazaarVoiceJSActions: BazaarVoiceJSActionCreators;
}

export interface BreadcrumbProps {
    breadcrumbListItems: BreadcrumbListItem[];
}
export interface BreadcrumbProps {
    category: Category;
    product: Product;
}

export interface OwnState {
    displayMode: "form" | "success" | "failure";
    canSubmit: boolean;
    showGuidelines: boolean;
    formError?: FormError;
    error?: ErrorType;
    verifiedPurchaserQueryParams: VerifiedPurchaserQueryParams;
}

export interface RouteParams {
    seoName: string;
    sku: string;
}

export type CreateProductReviewPageProps = StateProps & DispatchProps & InjectedIntlProps & RouteComponentProps;

export class CreateProductReviewPage extends React.PureComponent<CreateProductReviewPageProps, OwnState> {
    private scripts: Array<{src: string; async: boolean | undefined}> = [];

    public constructor(props: CreateProductReviewPageProps) {
        super(props);
        this.state = {
            displayMode: "form",
            canSubmit: false,
            showGuidelines: false,
            verifiedPurchaserQueryParams: defaultVerifiedPurchaserQueryParams,
        };

        if (
            this.props.bazaarvoiceConfig.product.dccBvLoader.src &&
            typeof window !== "undefined" &&
            !(window as any).BV
        ) {
            this.scripts.push({
                src: this.props.bazaarvoiceConfig.product.dccBvLoader.src.replace(
                    "-locale-",
                    convertLocaleToBazaarVoiceLocale(this.props.locale),
                ),
                async: this.props.bazaarvoiceConfig.product.dccBvLoader.async,
            });
        }
        bazaarVoiceJSActionCreators.loadedProductReviewsJS();
    }

    public async componentDidMount() {
        await this.props.productActions.syncCreateProductReviewStateWithLocation(this.props.location);
        this.trackPageLoad();
        this.setState({
            verifiedPurchaserQueryParams: this.createVerifiedPurchaserQueryParams(),
        });

        // Due to technical limitation of BV scripts to replace another BV script's context forces
        // Best Buy to reload the page when cross script page visit happens in SPA. This is a
        // temporary fix which will be addressed by either BV or BBY moving to use BV API.
        // Note - reload will be only called on this page because it only happens when a user
        // navigates to this page directly after visiting Seller Profile page (in SPA context).
        // Currently, there is a no direct path to this page and this has been added for an additional
        // safety to avoid chances of data corruption on BV.
        if (this.props.bazaarVoiceJS.isloadedSellerReviewsJS && this.props.bazaarvoiceSellerReviewsEnabled) {
            location.reload();
        }
    }

    public RenderFailure() {
        return (
            <div className={styles.reviewSubmitErrorContainer} data-automation="review-confirmation">
                {this.state.error && <Error errors={{error: this.state.error}} />}
            </div>
        );
    }

    public componentWillReceiveProps(nextProps: CreateProductReviewPageProps) {
        if (
            this.props.bazaarvoiceSellerReviewsEnabled !== nextProps.bazaarvoiceSellerReviewsEnabled &&
            this.props.bazaarVoiceJS.isloadedSellerReviewsJS
        ) {
            location.reload();
        }
    }

    public render() {
        const breadcrumbList = this.props.product
            ? createBreadcrumbList(this.props, this.getBreadcrumbEnds(this.props.intl))
            : null;
        const shouldRenderFailure = this.state.displayMode === CreateReviewPageDisplayModes.failure;

        return shouldRenderFailure ? (
            this.RenderFailure()
        ) : (
            <div>
                {this.props.bazaarVoiceEnabled && <HeadTags scripts={this.scripts} />}
                <Header />
                {this.props.bazaarVoiceEnabled && <DeviceFingerprint />}
                <PageContent>
                    {this.state.displayMode === CreateReviewPageDisplayModes.form && (
                        <>
                            {!breadcrumbList || !breadcrumbList.length ? (
                                <BreadcrumbPlaceholder />
                            ) : (
                                <BreadcrumbList
                                    breadcrumbListItems={breadcrumbList}
                                    className={styles.customBreadcrumbListPadding}
                                />
                            )}
                            <h1
                                className={styles.headline}
                                itemProp="name"
                                data-automation="write-review-page-headline">
                                {this.props.intl.formatMessage(messages.writeReviewPageHeading)}
                            </h1>
                            <ReviewedProduct product={this.props.product} params={this.props.params} />
                            <Divider className={classname([styles.muiOverride, styles.dividerWithMargin])} />
                            <ReviewFormWithIntl
                                {...this.state}
                                verifiedPurchaserQueryParams={this.state.verifiedPurchaserQueryParams}
                                onFormSubmit={this.handleFormSubmit}
                                formatMessage={this.props.intl.formatMessage}
                                screenSize={this.props.screenSize}
                                onGuidelinesClick={this.handleGuidelinesClick}
                                bazaarVoiceEnabled={this.props.bazaarVoiceEnabled}
                                env={this.props.env}
                                campaignId={this.props.location?.query?.campaignId || null}
                            />
                        </>
                    )}
                    {this.state.displayMode === CreateReviewPageDisplayModes.success && (
                        <ReviewSubmitConfirmation bazaarVoiceEnabled={this.props.bazaarVoiceEnabled} />
                    )}
                </PageContent>
                <Footer />
            </div>
        );
    }

    private handleGuidelinesClick = (e: any) => {
        e.preventDefault();
        const showGuidelines = this.state.showGuidelines;
        this.setState({showGuidelines: !showGuidelines});
    };

    private handleFormSubmit = async (_: any, e: React.FormEvent, data: HTMLFormElement) => {
        e.preventDefault();

        if (this.props.bazaarVoiceEnabled) {
            const DOMfingerprint = document.getElementById("ioBlackBox").value;
            data.deviceFingerprint.value = DOMfingerprint;
            sendReviewAnalytics(
                {
                    sku: this.props.product.sku,
                    brandName: this.props.product.brandName,
                    primaryParentCategoryId: this.props.product.primaryParentCategoryId,
                },
                "submit",
                "CreateProductReviewPage",
            );
        }
        const mapFormDataToPayload = (formData: any) =>
            Object.keys(formData).reduce(
                (acc, attr) => {
                    switch (attr) {
                        case "rating":
                            const rating = parseInt(formData[attr].value, 10) || "";
                            return {...acc, rating};

                        case "isRecommended":
                            const isRecommended = formData[attr].value.toString();
                            return {...acc, isRecommended};

                        case "keyConsiderationQuality":
                            const keyConsiderationQuality = parseInt(formData[attr].value, 10) || null;
                            return {
                                ...acc,
                                keyConsiderations: {
                                    ...acc.keyConsiderations,
                                    quality: keyConsiderationQuality,
                                },
                            };

                        case "keyConsiderationValue":
                            const keyConsiderationValue = parseInt(formData[attr].value, 10) || null;
                            return {
                                ...acc,
                                keyConsiderations: {
                                    ...acc.keyConsiderations,
                                    value: keyConsiderationValue,
                                },
                            };

                        case "keyConsiderationEaseOfUse":
                            const keyConsiderationEaseOfUse = parseInt(formData[attr].value, 10) || null;
                            return {
                                ...acc,
                                keyConsiderations: {
                                    ...acc.keyConsiderations,
                                    easeOfUse: keyConsiderationEaseOfUse,
                                },
                            };

                        default:
                            return {...acc, [attr]: formData[attr].value};
                    }
                },
                {
                    keyConsiderations: {},
                },
            );
        const response = await this.props.productActions.writeReview(
            {
                ...mapFormDataToPayload(data),
                productId: this.props.product.sku,
            },
            () => {
                this.handleFormSubmit(type, e, data);
            },
        );

        if (response.status === StatusCode.OK) {
            this.props.productActions.trackProductReviewConfirmationPageView();
            this.setState({displayMode: "success"});
        } else if (response.status === StatusCode.BadRequest) {
            const json = await response.json();
            if ((json.FormErrors && json.FormErrors.length) || json.ErrorCode) {
                this.setState({formError: json});
            }
        } else if (response.status === StatusCode.InternalServerError) {
            errorActions.error(response, () => this.handleFormSubmit(type, e, data));
            this.setState({displayMode: "failure", error: response});
        }
    };

    private getBreadcrumbEnds = (intl: InjectedIntl): BreadcrumbListItem[] => {
        const breadcrumbs = [];
        breadcrumbs.push(this.getProductBreadcrumbLeaf(intl));
        breadcrumbs.push({label: intl.formatMessage(messages.writeReviewPageHeading)});
        return breadcrumbs;
    };

    private getProductBreadcrumbLeaf(intl: InjectedIntl): BreadcrumbListItem {
        const {product} = this.props;
        return {
            linkTypeId: product.sku,
            label: product.name,
            linkType: "product",
            seoText: product.seoText,
        };
    }

    private createVerifiedPurchaserQueryParams = (): VerifiedPurchaserQueryParams => {
        if (
            window &&
            window.location &&
            window.location.search &&
            window.location.search.toLowerCase().indexOf("verifiedpurchaser=true") >= 0
        ) {
            return Object.assign({}, defaultVerifiedPurchaserQueryParams, parseQueryString(window.location.search));
        }
        return defaultVerifiedPurchaserQueryParams;
    };

    private trackPageLoad = () => this.props.productActions.trackWriteProductReviewPageView();
}

const mapStateToProps: MapStateToProps<StateProps, CreateProductReviewPageProps, State> = (state, props) => {
    return {
        bazaarVoiceEnabled: !!state.config.features.bazaarVoiceEnabled,
        bazaarvoiceSellerReviewsEnabled: !!state.config.features.bazaarvoiceSellerReviewsEnabled,
        language: state.intl.language,
        locale: state.intl.locale,
        location: state.routing.locationBeforeTransitions as Location,
        user: state.user,
        hasMatchingProduct: (state.product.product && state.product.product.sku) === props.params.sku,
        product: state.product.product,
        category: state.product.category,
        routing: state.routing,
        screenSize: getScreenSize(state),
        env: getCmsEnvironment(state.config.environment || ""),
        bazaarvoiceConfig: state.config.bazaarvoice,
        bazaarVoiceJS: state.bazaarVoiceJS,
    };
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, CreateProductReviewPageProps> = (dispatch) => {
    return {
        routingActions: bindActionCreators(routingActions, dispatch),
        errorActions: bindActionCreators(errorActions, dispatch),
        userActions: bindActionCreators(userActions, dispatch),
        productActions: bindActionCreators(productActions, dispatch),
        searchActions: bindActionCreators(searchActions, dispatch),
        bazaarVoiceJSActions: bindActionCreators(bazaarVoiceJSActionCreators, dispatch),
    };
};

export default connect<StateProps, DispatchProps, CreateProductReviewPageProps, State>(
    mapStateToProps,
    mapDispatchToProps,
)(injectIntl(CreateProductReviewPage));
