import * as React from "react";
import {CustomerReviews, DetailedProduct} from "models";
import {NoVerifiedPurchaserMessage} from "../../../../../../components/NoVerifiedPurchaserMessage";
import {WriteReviewButton} from "../../../../../../components/WriteReviewButton/WriteReviewButton";
import * as styles from "./style.css";
import CustomerReviewsList from "../../../CustomerReviewsList";
import {ReviewsAggregation} from "../../../ReviewsAggregation";
import ExploreReviewsButton from "../../../ExploreReviewsButton";
import useTrackTabVisit from "hooks/useTrackVisit";
import ReviewsToolbar from "../../../../../../components/ReviewsToolbar";

export interface ReviewsTabProps {
    customerReviews: CustomerReviews;
    product: DetailedProduct;
    maxNumReviewsShown?: number;
    disableSeoAttributes?: boolean;
    language: Language;
}

export const ReviewsTab: React.FC<ReviewsTabProps> = ({
    customerReviews,
    product,
    maxNumReviewsShown = 3,
    disableSeoAttributes,
    language,
}) => {
    const {sku, brandName, primaryParentCategoryId, shortDescription, seoText} = product;
    const {ref} = useTrackTabVisit({
        payload: {
            sku,
            customLink: "Customer Review on PDP Impression",
        },
        event: "PDP_TAB_IMPRESSION",
    });
    const {customerReviews: reviews, ratingSummary, filter} = customerReviews;
    const seoDetails = {
        productShortDescription: shortDescription,
        ratingSummary,
    };

    let localeReviewsCount = 0;

    if (ratingSummary && ratingSummary.localeReviewCount) {
        localeReviewsCount =
            language === "fr" ? ratingSummary.localeReviewCount.french : ratingSummary.localeReviewCount.english;
    }
    return (
        <div className={styles.reviewsTabContainer} ref={ref}>
            <ReviewsAggregation
                productSku={sku}
                productBrandName={brandName}
                productPrimaryParentCategoryId={primaryParentCategoryId}
                ratingSummary={ratingSummary}
            />
            {localeReviewsCount !== 0 && <ReviewsToolbar />}
            {Array.isArray(reviews) && reviews.length > 0 && (
                <div className={styles.reviewsListContainer}>
                    <CustomerReviewsList
                        reviews={reviews}
                        numReviewsDisplayed={maxNumReviewsShown}
                        seo={seoDetails}
                        disableSeoAttributes={disableSeoAttributes}
                    />
                </div>
            )}
            {filter.verifiedPurchaserToggleSelected && Array.isArray(reviews) && reviews.length === 0 && (
                <NoVerifiedPurchaserMessage className={styles.customMargin} />
            )}
            {reviews.length > maxNumReviewsShown && (
                <div className={styles.exploreReviewContainer}>
                    <ExploreReviewsButton
                        productSku={sku}
                        productName={seoText}
                        className={styles.customButtonMargin}
                    />
                    <WriteReviewButton
                        productSku={sku}
                        productBrandName={brandName}
                        primaryParentCategoryId={primaryParentCategoryId}
                    />
                </div>
            )}
        </div>
    );
};

export default ReviewsTab;
