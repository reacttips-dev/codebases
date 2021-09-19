import PropTypes from 'prop-types';

import SingleReview from 'components/common/SingleReview';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';

import css from 'styles/components/landing/brandReviews.scss';

export const BrandReviews = props => {
  const { slotDetails, onTaxonomyComponentClick, shouldLazyLoad } = props;
  const { reviews, brand, monetateId } = slotDetails;

  if (reviews?.length && brand) {
    const reviewsList = reviews.map(eachReview => {
      const { id } = eachReview;
      return <SingleReview
        key={id}
        singleReview={eachReview}
        onTaxonomyComponentClick={onTaxonomyComponentClick}
        shouldLazyLoad={shouldLazyLoad} />;
    });
    return (
      <div className={css.mainReviewsWrapper} data-monetate-id={monetateId}>
        <h2>Latest {brand.name} Reviews</h2>
        {reviewsList}
      </div>
    );
  }
  return null;
};

BrandReviews.contextTypes = {
  testId: PropTypes.func
};

export default withErrorBoundary('BrandReviews', BrandReviews);
