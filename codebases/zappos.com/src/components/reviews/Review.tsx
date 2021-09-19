import React, { useState } from 'react';
import { Link } from 'react-router';
import cn from 'classnames';

import ProductAwareAmethystViewableImpression from 'components/productdetail/ProductAwareAmethystViewableImpression';
import {
  DEFAULT_REVIEWER_NAME
} from 'constants/appConstants';
import { formatDate, parseDate } from 'helpers/dateUtils';
import Rating from 'components/Rating';
import { ButtonSpinner } from 'components/Loader';
import Tooltip from 'components/common/Tooltip';
import FitSurvey from 'components/reviews/FitSurvey';
import ReviewGalleryMediaGridElement from 'components/reviews/ReviewGalleryMediaGridElement';
import HtmlToReact from 'components/common/HtmlToReact';
import { valueFromFitSurveyText } from 'helpers/ReviewUtils';
import { evProductReviewImpression } from 'events/productReview';
import useMartyContext from 'hooks/useMartyContext';
import { CleanedProductReview } from 'reducers/reviews/cleanReviews';

import css from 'styles/components/reviews/review.scss';

const makeRating = (shouldRender: boolean, value: string, label: string, dataTestId = '', additionalClasses = '') => (
  shouldRender && (
    <span data-test-id={dataTestId}>
      <em className={css.ratingLabel}>{label}</em>
      <Rating rating={value} additionalClasses={additionalClasses} />
    </span>
  )
);

const formatReviewDate = (date?: number | string) => formatDate('MMMM D, YYYY', parseDate(date));
const createDateTime = (date: string) => {
  const jsDate = new Date(date);
  return isNaN(jsDate.getTime()) ? '' : jsDate.toISOString();
};

interface StructuredData {
  itemProp?: string;
  itemScope?: boolean;
  itemType?: string;
}

interface Props {
  brandName?: string;
  defaultImage?: string;
  description?: string;
  forceTabularRatings?: boolean;
  hiddenMediaItemIndex?: null | number;
  limitSummaryHeight?: boolean;
  loadingReviews: string[];
  onReviewMediaClick: (reviewId: string, mediaIndex: number) => void;
  onReviewUpvoteClick: (reviewId: string) => void;
  productName: string;
  review: CleanedProductReview;
  shouldRenderStructuredData?: boolean;
  showFitSurvey?: boolean;
  showMedia?: boolean;
  submittedReviews: string[];
}

const Review = ({
  brandName,
  defaultImage,
  description,
  forceTabularRatings = false,
  hiddenMediaItemIndex = null,
  limitSummaryHeight = false,
  loadingReviews,
  onReviewMediaClick,
  onReviewUpvoteClick,
  productName,
  review,
  shouldRenderStructuredData = true,
  showFitSurvey = true,
  showMedia = true,
  submittedReviews
}: Props) => {
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const { testId } = useMartyContext();

  const {
    authorByline,
    comfortRating,
    customerRewardReview,
    date,
    formattedDate,
    incentivizedReview,
    lookRating,
    name,
    otherShoes,
    overallRating,
    premierReview,
    reviewDate,
    shoeArch,
    shoeSize,
    shoeWidth,
    source,
    summary,
    // TODO if your API is giving you booleans, numbers, etc. as strings,
    // please convert them properly in a reducer.
    upVotes,
    verifiedPurchase
  } = review;

  const onReadMoreClick = () => {
    setIsSummaryExpanded(isExpanded => !isExpanded);
  };

  const makeBadges = () => (
    <div className={css.badges}>
      {source && <span className={css.badge} data-test-id={testId('externalReview')}>Reviewed at {source}</span>}
      {premierReview && (
        <span className={css.badge} data-test-id={testId('premierReview')}>
            Premier Review of Free Product
          <Link
            to="/c/premier-reviewers"
            className={css.whatsThis}
            aria-label="What are premier reviews?"
            data-test-id={testId('premierReviewLink')}>
              (What's this?)
          </Link>
        </span>
      )}
      {verifiedPurchase && <span className={css.badge} data-test-id={testId('verifiedPurchase')}>Verified Purchase</span>}
      {incentivizedReview && (
        <span className={css.badge} data-test-id={testId('incentivizedReview')}>
            Incentivized Review
          <Tooltip content="This review was submitted as a sweepstakes or contest entry in exchange for an opportunity to win a prize." wrapperClassName={cn(css.spaceLeft, css.whatsThis)}>
            <button className={css.linkButton} type="button" aria-describedby="incentivizedReview">(What's This?)</button>
            <div role="tooltip" id="incentivizedReview" className="screenReadersOnly">This review was submitted as a sweepstakes or contest entry in exchange for an opportunity to win a prize.</div>
          </Tooltip>
        </span>
      )}
      {customerRewardReview && (
        <span className={css.badge} data-test-id={testId('reviewForRewards')}>
            Review for Zappos VIP Points
          <Link
            to="/c/vip-faqs"
            className={css.whatsThis}
            data-test-id={testId('reviewRewardsLink')}
            aria-label="What are Zappos VIP Points?">
              (What's this?)
          </Link>
        </span>
      )}
    </div>
  );

  const makeUpvoteButton = () => {
    const { id: reviewId } = review;

    const isUpvoteLoading = loadingReviews.includes(reviewId);

    if (isUpvoteLoading) {
      return <ButtonSpinner size="14" className={css.spinner} />;
    }

    const isUpvoteSubmitted = submittedReviews.includes(reviewId);
    if (isUpvoteSubmitted) {
      return <p data-test-id={testId('reviewVotedText')}>Thank you for your feedback!</p>;
    }

    return (
      <button
        type="button"
        className={css.upvoteButton}
        onClick={onReviewUpvoteClick.bind(this, reviewId)}
        disabled={isUpvoteLoading}
        data-test-id={testId('helpfulVoteReviews')}>
        <span className={css.upvoteButtonIcon} /> Helpful?
      </button>
    );
  };

  const makeNewReviewFooter = () => {

    const dateStructuredData: StructuredData = {};
    if (shouldRenderStructuredData) {
      dateStructuredData.itemProp = 'datePublished';
    }

    // If available, use formatted date. Otherwise, use a formatted reviewDate/date in that order;
    // If both reviewDate and date are not defined, formatReviewDate will return the current date;
    const displayDate = formattedDate || formatReviewDate(reviewDate || date);
    const dateTime = createDateTime(displayDate);
    const upvotes = getUpvotes();
    return (
      <div className={css.footer}>
        <div>
          <span data-test-id={testId('reviewerName')}>{authorByline}
          </span>, <time data-test-id={testId('publishedDate')} {...dateStructuredData} dateTime={dateTime}>{displayDate}</time>
          {shouldRenderStructuredData && <meta itemProp="author" content={name || DEFAULT_REVIEWER_NAME } />}
        </div>
        <div className={css.upvoteButtonContainer} data-test-id={testId('helpfulVoteModal')}>
          {makeUpvoteButton()}
        </div>
        <div className={css.voteCountText}>
          <span className={css.voteCount} data-test-id={testId('upvoteCount')}>{upvotes}</span> found this review helpful.
        </div>
      </div>
    );
  };

  const getUpvotes = () => parseInt(upVotes, 10) || 0;

  const makeReviewMedia = () => {
    const { reviewGalleryMedia, id } = review;
    if (reviewGalleryMedia && reviewGalleryMedia.length) {
      return reviewGalleryMedia.reduce((acc: JSX.Element[], mediaItemData, index) => {
        // this current user experience is not great
        // we should just use a border around the currently shown thumbnail like we do for pdp thumbs
        if (index !== hiddenMediaItemIndex) {
          const mediaItem = { url: mediaItemData.msaMediaUrl || mediaItemData.mediaUrl, type: mediaItemData.mediaType, label: mediaItemData.label };
          acc.push(<ReviewGalleryMediaGridElement
            key={mediaItem.url}
            reviewId={id}
            onOpenMediaReview={onReviewMediaClick.bind(this, id, index)}
            mediaIndex={index}
            mediaItem={mediaItem}
            showVideoThumbnails={true}
            compact={true}
          />);
        }
        return acc;
      }, []);
    } else {
      return null;
    }
  };

  const isSummaryLong = summary?.length >= 200;
  const showSummaryExpander = limitSummaryHeight && isSummaryLong;
  const isExpanderHeightUnlimited = (!limitSummaryHeight) || (!isSummaryLong) || isSummaryExpanded;

  const containerStructuredData: StructuredData = {};
  const ratingStructuredData: StructuredData = {};
  const summaryStructuredData: StructuredData = {};
  if (shouldRenderStructuredData) {
    containerStructuredData.itemProp = 'review';
    containerStructuredData.itemScope = true;
    containerStructuredData.itemType = 'http://schema.org/Review';

    ratingStructuredData.itemProp = 'reviewRating';
    ratingStructuredData.itemScope = true;
    ratingStructuredData.itemType = 'http://schema.org/Rating';

    summaryStructuredData.itemProp = 'reviewBody';
  }

  return (
    <ProductAwareAmethystViewableImpression event={evProductReviewImpression} review={review}>
      <div
        className={cn(css.container, { [css.showFitSurvey]: showFitSurvey })}
        data-test-id={testId('reviewItem')}
        {...containerStructuredData}>
        {shouldRenderStructuredData && (
          <span itemProp="itemReviewed" itemType="http://schema.org/Product">
            <meta itemProp="brand" content={brandName} />
            <meta itemProp="name" content={productName}/>
            <meta itemProp="description" content={description} />
            <meta itemProp="image" content={defaultImage} />
          </span>
        )}
        <div>
          <div className={cn({ [css.opinionWithFitSurvey]: shoeSize || shoeArch || shoeWidth })}>
            <div className={css.ratings} {...ratingStructuredData}>
              <div className={cn(css.ratingWrapper, { [css.forceTabularRatings]: forceTabularRatings })}>
                {makeRating(true, overallRating, 'Overall', testId('overallStarRating'), cn(css.ratingLayout, { [css.forceTabularRatings]: forceTabularRatings }))}
                {shouldRenderStructuredData && <meta itemProp="ratingValue" content={overallRating}/>}
              </div>
              <div className={cn(css.ratingWrapper, { [css.forceTabularRatings]: forceTabularRatings })}>
                {makeRating(!!comfortRating, comfortRating, 'Comfort', testId('comfortStarRating'), cn(css.ratingLayout, { [css.forceTabularRatings]: forceTabularRatings }))}
              </div>
              <div className={cn(css.ratingWrapper, { [css.forceTabularRatings]: forceTabularRatings })}>
                {makeRating(!!lookRating, lookRating, 'Style', testId('styleStarRating'), cn(css.ratingLayout, { [css.forceTabularRatings]: forceTabularRatings }))}
              </div>
            </div>
            {makeBadges()}
            <div className={css.fitSurveyWrapper}>
              {showFitSurvey &&
              // TODO process these in the reducer (see mweb/marty issue #6439)
                <FitSurvey sizeRating={valueFromFitSurveyText(shoeSize)} widthRating={valueFromFitSurveyText(shoeWidth)} archRating={valueFromFitSurveyText(shoeArch)} />
              }
            </div>
            <div className={css.summary} data-test-id={testId('reviewBody')} {...summaryStructuredData}>
              <HtmlToReact className={cn(css.summaryHeightLimitWrapper, { [css.expanded]: isExpanderHeightUnlimited })} data-test-id={testId('reviewText')}>
                {summary}
              </HtmlToReact>
              {showSummaryExpander && (
                <button
                  type="button"
                  className={css.summaryExpander}
                  onClick={onReadMoreClick}
                  data-test-id={testId('reviewExpander')}>
                  {isSummaryExpanded ? 'Show Less' : 'Read More'}
                </button>
              )}
            </div>
            {/* Brands I'd Also Recommend (desktop-only) */}
            {otherShoes && <div className={css.recommendedBrands} data-test-id={testId('reviewerRecommendedBrands')}>
              <strong>I'd also recommend:</strong> <HtmlToReact>{otherShoes}</HtmlToReact>
            </div>}
            {makeNewReviewFooter()}
            {showMedia && (
              <div className={css.mediaContainer} data-test-id={testId('additionalReviewImages')}>
                {makeReviewMedia()}
              </div>
            )}
          </div>
        </div>

      </div>
    </ProductAwareAmethystViewableImpression>
  );
};

export default Review;
