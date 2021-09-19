import React from 'react';
import cn from 'classnames';

import { archMap, sizeMap, widthMap } from 'constants/fitSurvey';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import Tooltip from 'components/common/Tooltip';
import { ArchRating, ProductFit, ProductReviewSummary, SizeRating, WidthRating } from 'types/cloudCatalog';
import { MartyContext } from 'utils/context';

import styles from 'styles/components/productdetail/fitSurvey.scss';

interface Props {
  archFit: ProductFit<ArchRating>;
  sizeFit: ProductFit<SizeRating>;
  widthFit: ProductFit<WidthRating>;
  reviewSummary: ProductReviewSummary;
  hydraBlueSkyPdp: boolean;
}

type AllRatings = SizeRating | WidthRating | ArchRating;

type RatingPercentages<T extends AllRatings> = Record<T, string> | null;

function makeFitSurveyTooltipContent<T extends AllRatings>(type: 'arch' | 'size' | 'width', ratingPercentages: RatingPercentages<T>, ratingMap: Map<T, string>) {
  const tooltipContent: React.ReactNode[] = [];
  ratingPercentages && ratingMap.forEach((value, key) => {
    const ratingPercentage = ratingPercentages[key] || '0';
    const formattedRatingPercentage = Math.round(parseFloat(ratingPercentage));
    tooltipContent.push(
      <li key={`${type}Rating-${value}`} className={styles.fitSurveyRating}>
        <span className={styles.percentBar}><span style={{ width: `${ratingPercentage}%` }}/></span>
        <span className={styles.percentNumber}>{formattedRatingPercentage}%</span>
        <span className={styles.ratingText}>{value}</span>
      </li>
    );
  });
  return tooltipContent;
}

export const FitSurvey = ({ hydraBlueSkyPdp, reviewSummary, archFit, sizeFit, widthFit }: Props) => {
  const { sizeRatingPercentages, widthRatingPercentages, archRatingPercentages } = reviewSummary;
  const hasFitRatings = reviewSummary.hasFitRatings === 'true';

  if (hasFitRatings) {
    const sizeFitContent = sizeFit &&
        <ul className={styles.fitSurveyTooltip}>
          {makeFitSurveyTooltipContent('size', sizeRatingPercentages, sizeMap)}
        </ul>;

    const widthFitContent = widthFit &&
        <ul className={styles.fitSurveyTooltip}>
          {makeFitSurveyTooltipContent('width', widthRatingPercentages, widthMap)}
        </ul>;

    const archFitContent = archFit &&
        <ul className={styles.fitSurveyTooltip}>
          {makeFitSurveyTooltipContent('arch', archRatingPercentages, archMap)}
        </ul>;

    return (
      <MartyContext.Consumer>
        {({ testId }) => (
          <div className={cn(styles.fitSurvey, { [styles.blueSky]: hydraBlueSkyPdp })}>
            <div className={styles.fitSurveyContent} data-test-id={testId('fitSurveyContainer')}>
              <h4>Fit Survey:</h4>
              {sizeFit ? <div className={styles.fitSection} data-test-id={testId('trueToSize')}>
                <Tooltip tooltipId="sizeFit" content={sizeFitContent}>
                  <strong>{sizeFit.percentage}%</strong> {sizeMap.get(sizeFit.text) || sizeFit.text}
                </Tooltip>
              </div> : null}
              {widthFit ? <div className={styles.fitSection} data-test-id={testId('trueToWidth')}>
                <Tooltip tooltipId="widthFit" content={widthFitContent}>
                  <strong>{widthFit.percentage}%</strong> {widthMap.get(widthFit.text) || widthFit.text}
                </Tooltip>
              </div> : null}
              {archFit ? <div className={styles.fitSection} data-test-id={testId('archSupport')}>
                <Tooltip tooltipId="archFit" content={archFitContent}>
                  <strong>{archFit.percentage}%</strong> {archMap.get(archFit.text) || archFit.text}
                </Tooltip>
              </div> : null}
            </div>
          </div>
        )}
      </MartyContext.Consumer>
    );
  } else {
    return null;
  }
};

export default withErrorBoundary('FitSurvey', FitSurvey);

