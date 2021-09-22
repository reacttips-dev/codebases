import * as React from "react";

import {CustomerReview, RatingSummary} from "models";

import CustomerReviewItem from "../CustomerReviewItem";
import * as styles from "./style.css";

interface CustomerReviewsSeo {
    productShortDescription: string;
    ratingSummary: RatingSummary;
}

interface Props {
    reviews: CustomerReview[];
    numReviewsDisplayed?: number;
    seo: CustomerReviewsSeo;
    disableSeoAttributes?: boolean;
}

const CustomerReviewsList: React.FC<Props> = ({reviews, numReviewsDisplayed, seo, disableSeoAttributes}) => {
    if (!reviews || reviews.length === 0) {
        return null;
    }

    const endIndex = numReviewsDisplayed || reviews.length;
    const reviewList = reviews.slice(0, endIndex).map((review, index) => {
        return (
            <CustomerReviewItem
                key={review.id}
                title={review.title}
                rating={review.rating}
                reviewId={review.id}
                isRecommended={review.isRecommended}
                reviewerName={review.reviewerName}
                reviewerLocation={review.reviewerLocation}
                submissionTime={review.submissionTime}
                comment={review.comment}
                syndicationSource={review.syndicationSource}
                productName={(seo && seo.productShortDescription) || ""}
                ratingSummary={(seo && seo.ratingSummary) || ({} as any)}
                isVerifiedPurchaser={review.isVerifiedPurchaser}
                totalNegativeFeedbackCount={review.totalNegativeFeedbackCount}
                totalPositiveFeedbackCount={review.totalPositiveFeedbackCount}
                disableSeoAttributes={disableSeoAttributes}
                keyConsiderations={review.keyConsiderations}
            />
        );
    });

    return (
        <ul data-automation="reviews-list" className={styles.reviewListWrapper}>
            {reviewList}
        </ul>
    );
};

export default CustomerReviewsList;
