import React from 'react';

import FitSurveyValue from 'components/icons/FitSurveyValue';

import css from 'styles/components/reviews/fitSurvey.scss';

const makeDimension = (rating: number, leftLabel: string, rightLabel: string) => (
  <div className={css.dimension}>
    <div className={css.dimensionLabels}>
      <span>{leftLabel}</span>
      <span>{rightLabel}</span>
    </div>
    <FitSurveyValue value={rating} />
  </div>
);

const makeFitSurvey = ({ archRating, sizeRating, widthRating }: Props) => (
  <div className={css.container}>
    {sizeRating && makeDimension(sizeRating, 'Runs Small', 'Runs Large')}
    {widthRating && makeDimension(widthRating, 'Runs Narrow', 'Runs Wide')}
    {archRating && makeDimension(archRating, 'Poor Support', 'Great Support')}
  </div>
);

interface Props {
  archRating?: number | null;
  sizeRating?: number | null;
  widthRating?: number | null;
}

const FitSurvey = (props: Props) => {
  const { archRating, sizeRating, widthRating } = props;
  const hasRatings = [archRating, sizeRating, widthRating].some(Boolean);
  return hasRatings ? makeFitSurvey(props) : null;
};

export default FitSurvey;
