import * as React from "react";
import {PercentageBar, FeedbackStarFull} from "@bbyca/bbyca-components";
import {FormattedMessage} from "react-intl";

import {RatingSummary, ReviewStarRating} from "models";

import * as styles from "./style.css";
import messages from "./translations/messages";

interface GranularRatingsProps {
    ratingSummary: RatingSummary;
}

interface ScaledReviewProps {
    stars: number;
    count: number;
}

const GranularRatings: React.FC<GranularRatingsProps> = ({ratingSummary}) => {
    const reviewsByStars: ScaledReviewProps[] =
        ratingSummary && ratingSummary.ratingDistribution ? getScaledReviews(ratingSummary) : [];

    return (
        <div className={styles.reviewFilterContainer}>
            <h3 className={styles.heading}>
                <FormattedMessage {...messages.heading} />
            </h3>
            {reviewsByStars &&
                reviewsByStars.map(({stars, count}) => (
                    <div key={stars} className={styles.reviewFilterItem}>
                        <p className={styles.scaleTitle}>{stars}</p>
                        <FeedbackStarFull className={styles.starContainer} />
                        <div className={styles.percentageBarContainer}>
                            <PercentageBar
                                totalValue={ratingSummary.reviewCount}
                                givenValue={count}
                                className={styles.percentageBar}
                            />
                        </div>
                        <p className={styles.scaleValue}>{count}</p>
                    </div>
                ))}
        </div>
    );
};

const getScaledReviews = (ratingSummary: RatingSummary): ScaledReviewProps[] => {
    const scaledReviews = [
        {stars: 5, count: ratingSummary.ratingDistribution[ReviewStarRating.Five]},
        {stars: 4, count: ratingSummary.ratingDistribution[ReviewStarRating.Four]},
        {stars: 3, count: ratingSummary.ratingDistribution[ReviewStarRating.Three]},
        {stars: 2, count: ratingSummary.ratingDistribution[ReviewStarRating.Two]},
        {stars: 1, count: ratingSummary.ratingDistribution[ReviewStarRating.One]},
    ];
    return scaledReviews;
};

export default GranularRatings;
