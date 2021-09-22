import * as React from "react";
import {FormattedMessage, FormattedPlural} from "react-intl";
import {Recommended} from "@bbyca/bbyca-components";

import messages from "./translations/messages";
import * as styles from "./style.css";

import {RatingSummary} from "models";

export interface RecommendationSummaryProps {
    className?: string;
    recommendedCount: number;
    notRecommendedCount: number;
}

export const RecommendationSummary: React.FC<RecommendationSummaryProps> = ({
    recommendedCount,
    notRecommendedCount,
    className = "",
}) => {
    const totalRecommendationCount = recommendedCount + notRecommendedCount;
    const recommendedPercentage = Math.round((recommendedCount / totalRecommendationCount) * 100);

    return (
        <div data-automation="recommendation-summary-container" className={className}>
            <h3 className={styles.recommendationSummaryTitle}>
                <FormattedMessage {...messages.title} />
            </h3>
            <div className={styles.percentageContainer}>
                <Recommended className={styles.happyFace} color={"black"} />
                <p className={styles.percentage} data-automation="recommendation-percentage">
                    {recommendedPercentage}%
                </p>
            </div>
            <p className={styles.recommendationSummaryDescription} data-automation="recommendation-description">
                <FormattedPlural
                    value={totalRecommendationCount}
                    one={
                        <FormattedMessage
                            {...messages.singularDescription}
                            values={{
                                numReviewers: (
                                    <span className={styles.boldedText}>
                                        <FormattedMessage {...messages.reviewer} />
                                    </span>
                                ),
                                recommendedCount: <span className={styles.boldedText}>{recommendedCount}</span>,
                            }}
                        />
                    }
                    other={
                        <FormattedMessage
                            {...messages.description}
                            values={{
                                numReviewers: (
                                    <span className={styles.boldedText}>
                                        <FormattedMessage {...messages.reviewers} values={{totalRecommendationCount}} />
                                    </span>
                                ),
                                recommendedCount: <span className={styles.boldedText}>{recommendedCount}</span>,
                            }}
                        />
                    }
                />
            </p>
        </div>
    );
};

export const hasValidRecommendationCounts = (ratingSummary: RatingSummary): boolean => {
    const recommendationCount = ratingSummary && ratingSummary.recommendationCount;
    const totalRecommendationCount: number =
        (recommendationCount && recommendationCount.positive + recommendationCount.negative) || 0;

    return (
        recommendationCount &&
        typeof recommendationCount.positive === "number" &&
        typeof recommendationCount.negative === "number" &&
        totalRecommendationCount > 0
    );
};
