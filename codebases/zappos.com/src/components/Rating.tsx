import React from 'react';
import cn from 'classnames';

import useMartyContext from 'hooks/useMartyContext';

import css from 'styles/components/rating.scss';

interface Props {
  additionalClasses?: string;
  hasDisplayReviewCount?: boolean;
  includeSeoMetadata?: boolean;
  itemReviewed?: string;
  rating: string | number;
  reviewCount?: string;
}

const Rating = (props: Props) => {
  const {
    additionalClasses, includeSeoMetadata = true, itemReviewed, rating, reviewCount = 0, hasDisplayReviewCount
  } = props;
  const {
    marketplace,
    testId
  } = useMartyContext();
  const { features: { showRatings } = {} } = marketplace;

  if (!showRatings) {
    return null;
  }

  const shouldRenderSeoMetadata = includeSeoMetadata && reviewCount && parseInt(reviewCount) > 0;

  if (!(parseInt(String(rating)) > 0)) {
    return null;
  }

  const outerSpanProps: Record<string, any> = {
    // We want the stars on the rating to shrink when they come from the MelodyCardProduct component, so check for that prop to add the correct className
    'className': cn(css.rating, additionalClasses),
    'itemScope': true,
    'data-star-rating': rating,
    'data-test-id': testId('rating')
  };
  let ratingMeta = null;
  let itemReviewedMeta = null;

  if (shouldRenderSeoMetadata) {
    outerSpanProps.itemProp = 'aggregateRating';
    outerSpanProps.itemType = 'http://schema.org/AggregateRating';
    ratingMeta = (
      <>
        <meta itemProp="ratingValue" content={String(rating)}/>
        <meta itemProp="reviewCount ratingCount" content={`${reviewCount}`}/>
      </>
    );

    if (itemReviewed) {
      itemReviewedMeta = (
        <span itemProp="itemReviewed" itemType="http://schema.org/Product" itemScope>
          <meta itemProp="name" content={itemReviewed}/>
        </span>
      );
    }
  }

  const makeReviewCount = () => {
    if (reviewCount && parseInt(reviewCount) > 0) {
      return <span className={css.count}>({reviewCount})</span>;
    }
  };

  return (
    <>
    <span {...outerSpanProps}>
      {itemReviewedMeta}
      {ratingMeta}
      <span className={css.numberOfStars}>{rating}</span>
      <span className="screenReadersOnly">Rated {rating} stars out of 5</span>
    </span>
    {hasDisplayReviewCount && makeReviewCount()}
    </>
  );
};

export default Rating;
