import React from 'react';

import { MOST_HELPFUL, NEWEST } from 'constants/appConstants';
import useMartyContext from 'hooks/useMartyContext';
import { IdentityFn } from 'types/utility';

import css from 'styles/components/reviews/reviewSort.scss';

const makeSortButton = (props: Props, testId: IdentityFn<string>, targetOrderingOfThisButton: string, text: string, testIdArg: string) => {
  const { onSortReviewsClick } = props;
  const currentOrdering = props.orderBy || MOST_HELPFUL;
  return (
    <button
      type="button"
      className={css.button}
      disabled={currentOrdering === targetOrderingOfThisButton}
      onClick={onSortReviewsClick.bind(this, targetOrderingOfThisButton)}
      aria-label={`Sort by ${text} reviews`}
      data-test-id={testId(testIdArg)}>{text}</button>
  );
};

interface Props {
  orderBy?: string;
  onSortReviewsClick: (orderBy: string) => void;
}

const ReviewSort = (props: Props) => {
  const { testId } = useMartyContext();
  return (
    <div className={css.reviewSort}>
      <span>Sort by:</span>
      {makeSortButton(props, testId, MOST_HELPFUL, 'Most Helpful', 'mostHelpfulSort')}
      {makeSortButton(props, testId, NEWEST, 'Newest', 'newestSort')}
    </div>
  )
  ;
};

export default ReviewSort;
