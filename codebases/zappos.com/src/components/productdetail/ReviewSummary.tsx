import React, { useMemo } from 'react';
import { Link } from 'react-router';
import cn from 'classnames';

import Rating from 'components/Rating';
import { pluralize } from 'helpers/index.js';
import { toThousandsSeparator } from 'helpers/NumberFormats';
import useMartyContext from 'hooks/useMartyContext';

import styles from 'styles/components/productdetail/reviewSummary.scss';

interface Props {
  rating: string;
  numReviews: string;
  productId: string;
  className?: string;
  hydraBlueSkyPdp?: boolean;
}

const ReviewSummary = ({ hydraBlueSkyPdp, rating, numReviews, productId, ...rest }: Props) => {
  const { testId } = useMartyContext();
  const ContainerElement = useMemo(() => (hydraBlueSkyPdp ? 'a' : Link), [hydraBlueSkyPdp]);
  const linkTarget = useMemo(() => (hydraBlueSkyPdp ? '#customerReviews' : `/product/review/${productId}`), [hydraBlueSkyPdp, productId]);
  // remember that this is not the same as `numReviews <= 0`
  if (!(parseInt(numReviews) > 0)) {
    return null;
  }

  const reviewsCountText = toThousandsSeparator(numReviews);
  const labelText = (
    hydraBlueSkyPdp
      ? `(${reviewsCountText})`
      : `${reviewsCountText} ${pluralize('Review', +numReviews)}`
  );

  return (
    <ContainerElement to={linkTarget} href={linkTarget} data-test-id={testId('productReviews')} {...rest}>
      <Rating
        additionalClasses={cn(styles.ratingLayout, { [styles.ratingLayoutBlueSky]: hydraBlueSkyPdp })}
        rating={rating}
        reviewCount={numReviews}
      />
      <span className={cn(styles.ratingLabel, { [styles.ratingLabelBlueSky]: hydraBlueSkyPdp })}>{labelText}</span>
    </ContainerElement>
  );
};

export default ReviewSummary;
