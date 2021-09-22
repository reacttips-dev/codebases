import Divider from "@material-ui/core/Divider";
import * as React from "react";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { IBrowser as ScreenSize } from "redux-responsive";

import { RoutingState } from "reducers";
import {
    routingActionCreators,
    RoutingActionCreators,
} from "actions";
import BackButton from "components/BackButton";
import Header from "components/Header";
import PageContent from "components/PageContent";
import OverallRatingSummary from "components/OverallRatingSummary";
import { decodeHTMLEntities } from "utils/decodeString";
import LoadMore from "components/ProductListing/LoadMore";
import routeManager from "utils/routeManager";
import HeadTags from "components/HeadTags";
import Link from "components/Link";
import Footer from "components/Footer";

import { SellerState } from "../../reducers";
import {
    sellerActionCreators,
    SellerActionCreators,
} from "../../actions";
import { SellerProfilePlaceholder } from "../SellerProfilePage/components/SellerProfilePlaceholder";
import SellerFeedbackItem from "../SellerProfilePage/components/SellerFeedbackItem";
import * as styles from "./style.css";
import messages from "./translations/messages";
import {getScreenSize} from "store/selectors";

export interface StateProps extends SellerState {
    locale: Locale;
    language: Language;
    routing: RoutingState;
    screenSize: ScreenSize;
    standalone: boolean;
}

export interface DispatchProps {
    actions: SellerActionCreators;
    routingActions: RoutingActionCreators;
}

export class SellerReviewsPage extends React.Component<StateProps & DispatchProps & InjectedIntlProps> {
    public render() {
        const { seller } = this.props;
        const shouldRenderPlaceholder = !seller || !seller.reviews;
        if (shouldRenderPlaceholder) {
            return (
                <div>
                    {!this.props.standalone && <Header />}
                    <SellerProfilePlaceholder />
                    <Footer />
                </div>
            );
        }
        const { score, reviewsCount } = seller.rating;
        const reviews = seller.reviews.reviews;
        const loadingMore = seller.reviews.loadingMore;
        const shouldLoadMoreReviews = seller.reviews.currentPage < seller.reviews.totalPages;
        const renderLoadMore = reviews.length !== 0 && shouldLoadMoreReviews;
        return (
            <div className={styles.container}>
                {this.generateHeadTags()}
                {!this.props.standalone && <Header />}

                <PageContent>
                    <div className={`${styles.content} ${styles.backButtonContainer}`} data-automation="back-navigation">
                        <BackButton canGoBack={true} onClick={this.backToProductDetails} />
                    </div>
                    {!this.props.standalone && this.props.screenSize.lessThan.small && <Divider className={styles.backDivider} />}
                    <div className={styles.content}>

                        <h1 className={styles.sellerReviewTitle}>
                            {this.props.intl.formatMessage(messages.title)}
                        </h1>
                        <div className={styles.titleHeader}>
                            <h2 className={styles.sellerTitle}>
                                {decodeHTMLEntities(this.props.seller.name)}
                            </h2>
                        </div>
                        <div className={styles.ratingContainer} data-automation="overall-rating" >
                            <OverallRatingSummary
                                rate={score}
                                count={reviewsCount} />
                        </div>
                        <div className={styles.reviewWrapper}>
                            <ul className={styles.reviewListWrapper}>
                                {reviews.map(({
                                    ratingValue,
                                    customerName,
                                    location,
                                    reviewText,
                                    dateCreated,
                                },            index, reviewArray) => {
                                    const hideDivider = index === reviewArray.length - 1;
                                    return (
                                        <div data-automation="seller-feedback" key={index}>
                                            <SellerFeedbackItem
                                                key={index}
                                                rating={ratingValue}
                                                reviewerName={customerName}
                                                reviewerLocation={location}
                                                comment={reviewText}
                                                submissionTime={dateCreated}
                                                hideDivider={hideDivider}
                                            />
                                        </div>
                                    );
                                })}
                            </ul>
                        </div>
                        {renderLoadMore && <Divider className={styles.loadMoreDivider} /> }
                        <div className={styles.loadMore} data-automation="load-more-button">
                            <Link to="sellerReviews"
                                params={[seller.id]}
                                query={{ page: seller.reviews.currentPage + 1 }}
                                className={styles.sellerReviewLink}
                            >
                                <LoadMore
                                    shouldRender={renderLoadMore}
                                    isLoading={loadingMore}
                                    screenSize={this.props.screenSize}
                                    labelText={this.props.intl.formatMessage(messages.loadMore)}
                                    onLoadMoreButtonTap={this.loadMoreResults}
                                    hideDivider={true}
                                />
                            </ Link>
                        </div>
                    </div>

                </PageContent>
                {
                    !this.props.standalone && <Footer />
                }
            </div >
        );
    }

    public async componentDidMount() {
        await this.syncSellerReviewsStateWithLocation(this.props);
        await this.sendPageLoadEvent();
    }

    private async syncSellerReviewsStateWithLocation(props: StateProps) {
        await this.props.actions.syncSellerReviewsStateWithLocation(props.routing.locationBeforeTransitions);
    }

    private async sendPageLoadEvent() {
        await this.props.actions.sellerReviewPageLoad();
    }

    private backToProductDetails = (e) => {
        this.props.routingActions.goBack();
    }

    private loadMoreResults = () => {
        this.props.actions.loadingMoreReviews(this.props.seller.id);
    }

    private generateHeadTags = () => {
        const { reviews } = this.props.seller;
        const titlePrefix = this.props.locale === "fr-CA" ? this.props.intl.formatMessage(messages.preHeadTitle) : "";
        const title = `${titlePrefix}${decodeHTMLEntities(this.props.seller.name)} ${this.props.intl.formatMessage(messages.headTitle)}`;
        const canonicalUrl = routeManager.getCanonicalUrlByKey(this.props.language, "sellerReviews", this.props.seller.id);
        const isLastPage = reviews && reviews.currentPage === reviews.totalPages;
        const isFirstPage = reviews.currentPage === 1;
        const getPageUrl = (relType, pageNum) => routeManager.getRelLinksByKey(this.props.language, "sellerReviews", relType, pageNum, this.props.seller.id);
        const relationNextUrl = reviews && !isLastPage ? getPageUrl("next", reviews.currentPage + 1) : "";
        const relationPrevUrl = !isFirstPage ? getPageUrl("prev", reviews.currentPage - 1) : "";

        const links = [
            (canonicalUrl && { rel: "canonical", href: canonicalUrl }),
            (relationNextUrl && { rel: "next", href: relationNextUrl }),
            (relationPrevUrl && { rel: "prev", href: relationPrevUrl }),
        ];

        return <HeadTags title={title} links={links} />;
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        locale: state.intl.locale,
        language: state.intl.language,
        isStandalone: state.app.environment.standalone,
        routing: state.routing,
        screenSize: getScreenSize(state),
        standalone: state.app.environment.standalone,
        ...state.seller,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(sellerActionCreators, dispatch),
        routingActions: bindActionCreators(routingActionCreators, dispatch),
    };
};

export default connect<StateProps, DispatchProps>
    (mapStateToProps, mapDispatchToProps)(injectIntl(SellerReviewsPage));
