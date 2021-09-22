import * as React from "react";
import {FormattedMessage} from "react-intl";

import StarRate from "components/StarRate";
import {RatingSummary} from "models/CustomerReviews";
import {classIf} from "utils/classname";

import messages from "./translations/messages";
import * as styles from "./style.css";

export interface RatingsSummaryProps {
    productSku: string;
    ratingSummary: RatingSummary;
}

export const RatingsSummary: React.FC<RatingsSummaryProps> = ({ratingSummary}) => {
    const averageRating = (ratingSummary && ratingSummary.averageRating) || 0;
    const nearestDecimalRating = (Math.round(parseFloat((averageRating).toString()) * 10) / 10).toFixed(1);
    const showAverageScore = averageRating > 0;
    const overallRatingCopyClasses = classIf(
        [styles.overallRatingCopy, styles.noOverallRatingCopy],
        !showAverageScore,
        styles.overallRatingCopy,
    ).trim();

    return (
        <section className={styles.overallRatingSummaryWithLink}>
            <h3 className={styles.overallRatingSummaryTitle}>
                <FormattedMessage {...messages.title} />
            </h3>
            <div className={styles.overallStarContainer}>
                {showAverageScore && <div className={styles.overallScore}>{nearestDecimalRating}</div>}
                <div className={styles.overallRatingContent}>
                    <span className={styles.overallStarRating}>
                        <StarRate hideRatingScoreAndReviewCount={true} rate={averageRating} size={"medium"} />
                    </span>
                </div>
            </div>
            <span className={overallRatingCopyClasses}>{generateRatingsMessage(ratingSummary)}</span>
        </section>
    );
};

export const generateRatingsMessage = (ratingSummary: RatingSummary) => {
    let returnMessage = <FormattedMessage {...messages.noReviews} />;

    if (ratingSummary && ratingSummary.reviewCount === 1) {
        returnMessage = <FormattedMessage {...messages.singularRating} values={{count: ratingSummary.reviewCount}} />;
    } else if (ratingSummary && ratingSummary.reviewCount > 0) {
        returnMessage = <FormattedMessage {...messages.overallRating} values={{count: ratingSummary.reviewCount}} />;
    }
    return returnMessage;
};

RatingsSummary.displayName = "RatingsSummary";
export default RatingsSummary;
