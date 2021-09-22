import * as React from "react";
import {FormattedMessage, InjectedIntlProps, injectIntl} from "react-intl";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {bindActionCreators} from "redux";
import {IBrowser as ScreenSize} from "redux-responsive";
import {Key} from "@bbyca/apex-components";
import {Loader, LoadingSkeleton} from "@bbyca/bbyca-components";

import {routingActionCreators, RoutingActionCreators, searchActionCreators, SearchActionCreators} from "actions";
import Header from "components/Header";
import HeadTags from "components/HeadTags";
import PageContent from "components/PageContent";
import {DetailedProduct as Product, CustomerReviews, BreadcrumbListItem} from "models";
import {RoutingState, BazaarVoiceJSState} from "reducers";
import routeManager from "utils/routeManager";
import LoadMore from "components/ProductListing/LoadMore";
import {State} from "store";
import Footer from "components/Footer";
import {createBreadcrumbList} from "utils/builders/breadcrumbBuilder/createBreadcrumbList";
import BreadcrumbList from "components/BreadcrumbList";
import {
    productActionCreators,
    ProductActionCreators,
    bazaarVoiceJSActionCreators,
    BazaarVoiceJSActionCreators,
} from "../../actions";
import {NoVerifiedPurchaserMessage} from "../../components/NoVerifiedPurchaserMessage";
import {WriteReviewButton} from "../../components/WriteReviewButton";
import ReviewsToolbar from "../../components/ReviewsToolbar";
import BreadcrumbPlaceholder from "../../components/BreadcrumbPlaceholder";
import * as styles from "./style.css";
import CustomerReviewsList from "../ProductDetailPage/components/CustomerReviewsList";
import messages from "./translations/messages";
import {ReviewsAggregation} from "../ProductDetailPage/components/ReviewsAggregation";
import {FeatureToggles} from "config";
import {getScreenSize} from "store/selectors";

export interface StateProps extends Pick<FeatureToggles, "bazaarvoiceSellerReviewsEnabled"> {
    language: Language;
    routing: RoutingState;
    loadingProduct: boolean;
    screenSize: ScreenSize;
    product: Product;
    customerReviews: CustomerReviews;
    bazaarVoiceJS: BazaarVoiceJSState;
}

export interface DispatchProps {
    productActions: ProductActionCreators;
    routingActions: RoutingActionCreators;
    searchActions: SearchActionCreators;
    bazaarVoiceJSActions: BazaarVoiceJSActionCreators;
}

export type ProductReviewsPageProps = StateProps & DispatchProps & InjectedIntlProps;

export class ProductReviewsPage extends React.Component<ProductReviewsPageProps> {
    public constructor(props: ProductReviewsPageProps) {
        super(props);
        props.bazaarVoiceJSActions.loadedProductReviewsJS();
    }

    public render() {
        if (!this.props.product) {
            return null;
        }

        let localeReviewsCount = 0;
        const {shortDescription, name, sku, brandName, primaryParentCategoryId, seoText} = this.props.product;
        const reviews = this.props.customerReviews;
        const {customerReviews, filter, loadingReviews, ratingSummary} = reviews;
        const shouldLoadMoreReviews = reviews.currentPage < reviews.totalPages;
        const renderLoadMore = !reviews.loadingReviews && reviews.customerReviews.length !== 0 && shouldLoadMoreReviews;
        const seoDetails = {
            productShortDescription: shortDescription,
            ratingSummary,
        };
        const breadcrumbList = this.props.product
            ? createBreadcrumbList(this.props, this.getBreadcrumbEnds(this.props.intl))
            : null;
        if (ratingSummary && ratingSummary.localeReviewCount) {
            localeReviewsCount =
                this.props.language === "fr"
                    ? ratingSummary.localeReviewCount.french
                    : ratingSummary.localeReviewCount.english;
        }

        return (
            <div className={styles.container}>
                {this.props.product && this.generateHeadTags()}
                <Header />

                <PageContent>
                    {!breadcrumbList || !breadcrumbList.length ? (
                        <BreadcrumbPlaceholder />
                    ) : (
                        <BreadcrumbList
                            breadcrumbListItems={breadcrumbList}
                            className={styles.customBreadcrumbListPadding}
                        />
                    )}
                    <div className={styles.productReviewsPageContainer}>
                        <div className={styles.productReviewsPageWrapper}>
                            <div>
                                {/* Page Header */}
                                <h1 className={styles.productReviewsPageTitle}>
                                    <FormattedMessage {...messages.customerReviews} />
                                </h1>
                                {/* ProductHeader */}
                                <h2 className={styles.productName}>{name}</h2>

                                <Loader
                                    loading={loadingReviews}
                                    loadingDisplay={
                                        <div className={styles.loadingReviews}>
                                            <h3 role="presentation">
                                                <LoadingSkeleton.Title maxWidth={200} />
                                            </h3>
                                            <LoadingSkeleton.Line maxWidth={300} />
                                            <LoadingSkeleton.Line maxWidth={300} />
                                        </div>
                                    }>
                                    <section className={styles.reviewsAggregationContainer}>
                                        <ReviewsAggregation
                                            productSku={sku}
                                            productBrandName={brandName}
                                            productPrimaryParentCategoryId={primaryParentCategoryId}
                                            ratingSummary={ratingSummary}
                                        />
                                    </section>
                                    <section className={styles.sortSection}>
                                        {localeReviewsCount !== 0 && <ReviewsToolbar />}
                                    </section>
                                    <section className={styles.reviewsSection}>
                                        {Array.isArray(customerReviews) && customerReviews.length > 0 && (
                                            <CustomerReviewsList reviews={customerReviews} seo={seoDetails} />
                                        )}
                                        {filter.verifiedPurchaserToggleSelected &&
                                            Array.isArray(customerReviews) &&
                                            customerReviews.length === 0 && (
                                                <NoVerifiedPurchaserMessage className={styles.customMargin} />
                                            )}
                                    </section>
                                </Loader>
                                <div
                                    className={styles.loadMore + " analytics-ui-events"}
                                    data-automation="load-more-button">
                                    {renderLoadMore && (
                                        <LoadMore
                                            className={styles.loadMoreContainer}
                                            shouldRender={renderLoadMore}
                                            isLoading={loadingReviews}
                                            labelText={this.props.intl.formatMessage(messages.loadMore)}
                                            onLoadMoreButtonTap={this.loadMoreResults}
                                            screenSize={this.props.screenSize}
                                            hideDivider={true}
                                            seoOptimized={true}
                                            linkKey={"productReviews" as Key}
                                            params={[seoText, sku]}
                                            query={{page: this.props.customerReviews.currentPage + 1}}
                                        />
                                    )}
                                    {Array.isArray(customerReviews) && customerReviews.length >= 10 && (
                                        <WriteReviewButton
                                            productSku={sku}
                                            productBrandName={brandName}
                                            primaryParentCategoryId={primaryParentCategoryId}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </PageContent>
                <Footer />
            </div>
        );
    }

    public async componentDidMount() {
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
        await this.syncProductReviewStateWithLocation(this.props);
        this.trackPageLoad();
    }

    public componentWillReceiveProps(nextProps: ProductReviewsPageProps) {
        if (this.props.routing.locationBeforeTransitions !== nextProps.routing.locationBeforeTransitions) {
            this.syncProductReviewStateWithLocation(nextProps);
        }

        if (
            this.props.bazaarvoiceSellerReviewsEnabled !== nextProps.bazaarvoiceSellerReviewsEnabled &&
            this.props.bazaarVoiceJS.isloadedSellerReviewsJS
        ) {
            location.reload();
        }
    }

    private syncProductReviewStateWithLocation(props: StateProps & DispatchProps & InjectedIntlProps) {
        if (props.productActions && props.productActions.syncProductReviewStateWithLocation) {
            props.productActions.syncProductReviewStateWithLocation(props.routing.locationBeforeTransitions);
        }
    }

    private generateHeadTags = () => {
        const {customerReviews, currentPage, totalPages} = this.props.customerReviews;
        const {seoText, sku, name} = this.props.product;
        const title = this.props.intl.formatMessage(messages.title, {name});

        const canonicalUrl =
            seoText &&
            sku &&
            routeManager.getCanonicalUrlByKey(this.props.language, "productReviews" as Key, seoText, sku);
        const isLastPage = customerReviews && currentPage === totalPages;
        const isFirstPage = currentPage === 1;
        const getPageUrl = (relType, pageNum) =>
            routeManager.getRelLinksByKey(this.props.language, "productReviews", relType, pageNum, sku);
        const relationNextUrl = customerReviews && !isLastPage ? getPageUrl("next", currentPage + 1) : "";
        const relationPrevUrl = !isFirstPage ? getPageUrl("prev", currentPage - 1) : "";

        const links = [
            canonicalUrl && {rel: "canonical", href: canonicalUrl},
            relationNextUrl && {rel: "next", href: relationNextUrl},
            relationPrevUrl && {rel: "prev", href: relationPrevUrl},
        ];

        return <HeadTags title={title} links={links} />;
    };

    private loadMoreResults = () => {
        this.trackLoadMoreClick();
        this.props.productActions.loadingMoreReviews();
    };

    private trackPageLoad = () => this.props.productActions.trackCustomerReviewPageView();

    private trackLoadMoreClick = () => this.props.productActions.trackCustomerReviewPageLoadMoreReviewsButtonClick();

    private getBreadcrumbEnds = (intl): BreadcrumbListItem[] => {
        const breadcrumbs = [];
        breadcrumbs.push(this.getProductBreadcrumbLeaf(intl));
        breadcrumbs.push({label: intl.formatMessage(messages.clientReviews)});
        return breadcrumbs;
    };

    private getProductBreadcrumbLeaf(intl): BreadcrumbListItem {
        const {product} = this.props;
        return {
            linkTypeId: product.sku,
            label: intl.formatMessage(messages.productDetails),
            linkType: "product",
            seoText: product.seoText,
        };
    }
}

const mapStateToProps: MapStateToProps<StateProps, {}, State> = (state) => {
    return {
        language: state.intl.language,
        routing: state.routing,
        screenSize: getScreenSize(state),
        bazaarVoiceJS: state.bazaarVoiceJS,
        bazaarvoiceSellerReviewsEnabled: !!state.config.features.mobileActivationUpgradeCheckEnabled,
        ...state.product,
    };
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = (dispatch) => {
    return {
        productActions: bindActionCreators(productActionCreators, dispatch),
        routingActions: bindActionCreators(routingActionCreators, dispatch),
        searchActions: bindActionCreators(searchActionCreators, dispatch),
        bazaarVoiceJSActions: bindActionCreators(bazaarVoiceJSActionCreators, dispatch),
    };
};

export default connect<StateProps, DispatchProps, {}, State>(
    mapStateToProps,
    mapDispatchToProps,
)(injectIntl(ProductReviewsPage));
