import * as React from "react";

import {RatingSummary} from "models";
import {classIf} from "utils/classname";

import {WriteReviewButton} from "../../../../components/WriteReviewButton";
import {RatingsSummary} from "./components/RatingsSummary";
import {RecommendationSummary, hasValidRecommendationCounts} from "./components/RecommendationSummary";
import FilterByRating from "../GranularRatings";
import KeyConsiderations from "../../../../components/KeyConsiderations";
import {isValidAttributeValue} from "../../../../components/KeyConsiderations/util";
import * as styles from "./style.css";

export interface ReviewsAggregationProps {
    productSku: string;
    productBrandName: string;
    productPrimaryParentCategoryId: string;
    ratingSummary: RatingSummary;
}

export const ReviewsAggregation: React.FC<ReviewsAggregationProps> = ({
    productSku,
    productBrandName,
    productPrimaryParentCategoryId,
    ratingSummary,
}) => {
    const totalReviewsCount: number = (ratingSummary && ratingSummary.reviewCount) || 0;
    const keyAttr = ratingSummary && ratingSummary.keyConsiderations;
    const hasRecommendationSummary = ratingSummary && hasValidRecommendationCounts(ratingSummary);
    const hasKeyConsiderations =
        keyAttr &&
        Object.keys(keyAttr).length !== 0 &&
        Object.values(keyAttr).some((val) => isValidAttributeValue(val));
    const rightPaneClass = classIf(
        styles.reviewsStatsRightPane,
        hasRecommendationSummary || hasKeyConsiderations,
        styles.noBorder,
    );
    const recommendationSummaryClass = classIf(styles.recommendationSummary, hasKeyConsiderations);
    return (
        <div className={styles.reviewsStatsContainer}>
            <div className={styles.reviewsStatsLeftPane}>
                <RatingsSummary productSku={productSku} ratingSummary={ratingSummary} />
                {totalReviewsCount > 0 && <FilterByRating ratingSummary={ratingSummary} />}
                <WriteReviewButton
                    productSku={productSku}
                    productBrandName={productBrandName}
                    primaryParentCategoryId={productPrimaryParentCategoryId}
                />
            </div>
            {totalReviewsCount > 0 && (
                <div className={rightPaneClass}>
                    {hasRecommendationSummary && (
                        <RecommendationSummary
                            className={recommendationSummaryClass}
                            recommendedCount={ratingSummary.recommendationCount.positive}
                            notRecommendedCount={ratingSummary.recommendationCount.negative}
                        />
                    )}
                    {hasKeyConsiderations && (
                        <KeyConsiderations
                            value={keyAttr.value}
                            easeOfUse={keyAttr.easeOfUse}
                            quality={keyAttr.quality}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

ReviewsAggregation.displayName = "ReviewsAggregation";

export default ReviewsAggregation;
