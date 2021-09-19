import React from 'react';

import useMartyContext from 'hooks/useMartyContext';
import Review from 'components/reviews/Review';
import { ProductReview, ProductReviewSummary } from 'types/cloudCatalog';

import css from 'styles/components/reviews/mostHelpfulReviews.scss';

interface Props {
  loadingReviews: string[];
  onReviewMediaClick: (reviewId: string, mediaIndex: number) => void;
  onReviewUpvoteClick: (reviewId: string) => void;
  productName: string;
  reviewSummary: ProductReviewSummary;
  submittedReviews: string[];
}

const MostHelpfulReviews = (props: Props) => {
  const {
    loadingReviews, onReviewMediaClick, onReviewUpvoteClick, productName,
    reviewSummary, submittedReviews
  } = props;
  const { testId } = useMartyContext();
  const { reviewWithMostVotes, reviewWithLeastVotes } = reviewSummary;

  if (MostHelpfulReviews.shouldRender(reviewSummary)) {
    return (
      <div className={css.container}>
        <div className={css.favorableReview}>
          {Number(reviewWithMostVotes?.overallRating) > 0 ? (
            <>
              <h3 className={css.topReviewHeading} data-test-id={testId('topPositiveReview')}>Top Positive Review</h3>
              <Review
                review={reviewWithMostVotes as ProductReview} // Casting here is ok, since the `shouldRender` method ensures this is not null
                productName={productName}
                forceTabularRatings={true}
                limitSummaryHeight={true}
                loadingReviews={loadingReviews}
                onReviewMediaClick={onReviewMediaClick}
                onReviewUpvoteClick={onReviewUpvoteClick}
                shouldRenderStructuredData={false}
                showFitSurvey={false}
                showMedia={false}
                submittedReviews={submittedReviews} />
            </>
          ) : <h3>Uh oh! No favorable reviews!</h3>}
        </div>
        <span className={css.vsSeparator}><strong>vs</strong></span>
        <div className={css.criticalReview}>
          {Number(reviewWithLeastVotes?.overallRating) > 0 ? (
            <>
              <h3 className={css.topReviewHeading} data-test-id={testId('topCriticalReview')}>Top Critical Review</h3>
              <Review
                review={reviewWithLeastVotes as ProductReview} // Casting here is ok, since the `shouldRender` method ensures this is not null
                productName={productName}
                forceTabularRatings={true}
                limitSummaryHeight={true}
                loadingReviews={loadingReviews}
                onReviewMediaClick={onReviewMediaClick}
                onReviewUpvoteClick={onReviewUpvoteClick}
                shouldRenderStructuredData={false}
                showFitSurvey={false}
                showMedia={false}
                submittedReviews={submittedReviews} />
            </>
          ) : <h3>Woohoo! No critical reviews!</h3>}
        </div>
      </div>
    );
  } else {
    return null;
  }
};

MostHelpfulReviews.shouldRender = (reviewSummary: ProductReviewSummary) => {
  const { reviewWithMostVotes, reviewWithLeastVotes } = reviewSummary;
  return Number(reviewWithMostVotes?.overallRating) > 0 && Number(reviewWithLeastVotes?.overallRating) > 0;
};

export default MostHelpfulReviews;
