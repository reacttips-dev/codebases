import cn from 'classnames';
import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { trackEvent } from 'helpers/analytics';
import { fetchProductReviews, upvoteReview } from 'actions/productDetail';
import HtmlToReact from 'components/common/HtmlToReact';
import { Loader } from 'components/Loader';
import MartyLink from 'components/common/MartyLink';
import Review from 'components/reviews/Review';
import MostHelpfulReviews from 'components/reviews/MostHelpfulReviews';
import ReviewSort from 'components/reviews/ReviewSort';
import { toThousandsSeparator } from 'helpers/NumberFormats';
import { buildSeoProductUrl } from 'helpers/SeoUrlBuilder';
import marketplace from 'cfg/marketplace.json';
import { pluralize } from 'helpers/index.js';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { track } from 'apis/amethyst';
import { evWriteProductReviewClick } from 'events/productReview';
import { PRODUCT_PAGE } from 'constants/amethystPageTypes';
import { AppState } from 'types/app';
import { MartyContext } from 'utils/context';
import { isAssigned } from 'actions/ab';
import { HYDRA_BLUE_SKY_PDP } from 'constants/hydraTests';

import css from 'styles/components/productdetail/reviewPreview.scss';

interface Params {
  productId: string;
  colorId?: string;
  seoName?: string;
}

interface OwnProps {
  onReviewMediaClick: (reviewId: string, mediaIndex: number) => void;
  params: Params;
}

type PropsFromRedux = ConnectedProps<typeof connector>;

const defaultProps = {
  trackEvent
};

type Props = OwnProps & PropsFromRedux & typeof defaultProps;
export class ReviewPreview extends Component<Props> {
  static defaultProps = defaultProps;

  getAddReviewUrl = ({ productId, colorId }: Params) => `/product/review/add/${productId}${colorId ? `/color/${colorId}` : ''}`;

  handleReviewUpvoteClick = (reviewId: string) => {
    const { product, params: { colorId }, upvoteReview, reviewData: { loadingReviews } } = this.props;
    if (!loadingReviews.includes(reviewId)) {
      const returnTo = buildSeoProductUrl(product, colorId);
      upvoteReview(reviewId, returnTo);
    }
  };

  handleSortReviewsClick = (orderBy: string) => {
    const { fetchProductReviews, params: { productId }, reviewData } = this.props;
    if (reviewData.orderBy === orderBy) {
      return;
    }
    fetchProductReviews(productId, 1, 0, false, orderBy);
  };

  makeBrandProductName = () => {
    const { brandProductName } = this.props.product || {};
    return <HtmlToReact>{brandProductName}</HtmlToReact>;
  };

  makeProductReviewContainerUrl(productId: string, orderBy?: string) {
    return `/product/review/${productId}${orderBy ? `/page/1/orderBy/${orderBy}` : ''}`;
  }

  makeReviewsHeading = () => (
    <>
      <h2 id="customerReviews" className={css.reviewsHeading}>Customer {pluralize('Review', this.props.reviewData.reviews?.length)}</h2>
      <div className={css.reviewsBrandProductName}>{this.makeBrandProductName()}</div>
    </>
  );

  makeReviewsList = (count: number) => {
    const {
      product,
      reviewData: { reviews, submittedReviews, loadingReviews },
      onReviewMediaClick
    } = this.props;

    if (!reviews || !product) {
      return null;
    }

    const { brandName, productName, description, defaultImageUrl } = product;

    return reviews.slice(0, count).map((review, i) => (
      <div key={review.id} className={cn(css.reviewWrapper, { [css.lastReviewWrapper]: i === count - 1 })}>
        <Review
          review={review}
          brandName={brandName}
          productName={productName}
          description={description?.bulletPoints?.[0] || ''}
          defaultImage={defaultImageUrl}
          loadingReviews={loadingReviews}
          submittedReviews={submittedReviews}
          onReviewUpvoteClick={this.handleReviewUpvoteClick}
          onReviewMediaClick={onReviewMediaClick} />
      </div>
    ));
  };

  handleWriteReviewClick = () => {
    const { params: { productId, colorId } } = this.props;
    track(() => ([
      evWriteProductReviewClick, { productId, colorId, addedFrom: PRODUCT_PAGE }
    ]));
  };

  render() {
    const {
      props: {
        hydraBlueSkyPdp,
        product,
        reviewData: {
          reviews: productReviews,
          isLoading, loadingReviews, orderBy, submittedReviews
        },
        params: { productId },
        params, showReviews, onReviewMediaClick
      },
      handleReviewUpvoteClick, makeBrandProductName, makeReviewsHeading
    } = this;

    if (!showReviews || !product) {
      return null;
    }

    const {
      reviewCount = 0,
      productName, reviewSummary
    } = product;
    return (
      <MartyContext.Consumer>
        {({ testId }) => (
          <div className={cn(css.container, { [css.fullWidth]: hydraBlueSkyPdp })} data-test-id={testId('reviewContainer')}>
            {MostHelpfulReviews.shouldRender(reviewSummary) && (
              <div className={css.mostHelpfulReviewsHeadingWrapper}>
                <h2 className={css.mostHelpfulReviewsHeading}>What Customers Are Saying</h2>
                <div className={css.mostHelpfulReviewsBrandProductName}>{makeBrandProductName()}</div>
              </div>
            )}
            {productReviews && productReviews.length ? (
          <>
            <MostHelpfulReviews
              reviewSummary={reviewSummary}
              data-test-id={testId('helpfulReviews')}
              loadingReviews={loadingReviews}
              onReviewMediaClick={onReviewMediaClick}
              onReviewUpvoteClick={handleReviewUpvoteClick}
              productName={productName}
              submittedReviews={submittedReviews}
            />
            {isLoading ? <Loader/> : (
              <>
                <div className={css.reviewsTitleContainer} data-test-id={testId('reviewsHeader')}>
                  {makeReviewsHeading()}
                  <div className={css.writeAReviewLink}>
                    <MartyLink
                      to={this.getAddReviewUrl(params)}
                      onClick={this.handleWriteReviewClick}
                      data-test-id={testId('writeAReviewButton')}>
                      Write a review
                    </MartyLink>
                  </div>
                  <div data-test-id={testId('sortOptions')}>
                    <ReviewSort orderBy={orderBy} onSortReviewsClick={this.handleSortReviewsClick}/>
                  </div>
                </div>
                {this.makeReviewsList(5)}
                <div className={css.readAdditionalReviewsWrapper}>
                  {reviewCount > 5 && (
                    <MartyLink
                      to={this.makeProductReviewContainerUrl(productId, orderBy)}
                      className={css.readAdditionalReviews}
                      data-test-id={testId('readAdditionalReviews')}>
                      <span>Read Additional {toThousandsSeparator(Number(reviewCount) - 5)} Customer Reviews</span>
                    </MartyLink>
                  )}
                </div>
              </>
            )}
          </>
            ) : null}
            {productReviews && !productReviews.length ? (
              <div className={css.noReviewsContainer}>
                {makeReviewsHeading()}
                <p data-test-id={testId('zeroReviewsText')} className={css.noReviewsText}>This product currently has 0 reviews.</p>
                <MartyLink
                  to={this.getAddReviewUrl(params)}
                  className={css.writeAReviewLink}
                  onClick={this.handleWriteReviewClick}
                  data-test-id={testId('writeAReviewButton')}>
              Write a review
                </MartyLink>
              </div>
            ) : null}
          </div>
        )}
      </MartyContext.Consumer>
    );
  }
}

function mapStateToProps(state: AppState) {
  const {
    product: { detail, reviewData }
  } = state;
  const { features: { showReviews } } = marketplace;
  return {
    hydraBlueSkyPdp: isAssigned(HYDRA_BLUE_SKY_PDP, 1, state),
    product: detail,
    showReviews,
    reviewData,
    returnTo: buildSeoProductUrl(detail)
  };
}

const mapDispatchToProps = {
  fetchProductReviews,
  upvoteReview
};

const connector = connect(mapStateToProps, mapDispatchToProps);
const ConnectedReviewPreview = connector(ReviewPreview);
export default withErrorBoundary('ReviewPreview', ConnectedReviewPreview);
