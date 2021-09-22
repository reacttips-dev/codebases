import * as React from "react";
import {FormattedMessage} from "react-intl";
import {Key} from "@bbyca/apex-components";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import * as styles from "./style.css";
import Link from "components/Link";
import SellerFeedbackItem from "../../components/SellerFeedbackItem";
import messages from "../../translations/messages";
import {SellerReview} from "models";
import useTrackTabVisit from "hooks/useTrackVisit";

export interface SellerReviewsProps {
    reviews: SellerReview[];
    sellerId: string;
    bazaarvoiceSellerReviewsEnabled: boolean;
}

export const SellerReviews: React.FC<SellerReviewsProps> = ({
    reviews,
    sellerId,
    bazaarvoiceSellerReviewsEnabled,
}: SellerReviewsProps) => {
    const {ref} = useTrackTabVisit({
        payload: {
            sku: sellerId,
            customLink: "Seller Review: Customer Reviews Impression",
        },
        event: "PDP_TAB_IMPRESSION",
    });
    const numShownReviews = 3;
    const linkProps = {
        params: [sellerId, ""],
        to: "sellerReviews" as Key,
    };

    return (
        <div className={styles.reviewWrapper} ref={ref}>
            {!bazaarvoiceSellerReviewsEnabled && (
                <h2 className={styles.sellerReviewTitle}>
                    <FormattedMessage {...messages.title} />
                </h2>
            )}
            {bazaarvoiceSellerReviewsEnabled && (
                <>
                    <div data-bv-show="review_highlights" data-bv-product-id={sellerId}></div>
                    <div data-bv-show="reviews" data-bv-product-id={sellerId}></div>
                </>
            )}

            {!bazaarvoiceSellerReviewsEnabled && (
                <ul className={styles.reviewListWrapper}>
                    {reviews
                        .slice(0, numShownReviews)
                        .map(({ratingValue, customerName, location, reviewText, dateCreated}, index) => (
                            <li data-automation="seller-feedback" key={index}>
                                <SellerFeedbackItem
                                    key={index}
                                    rating={ratingValue}
                                    reviewerName={customerName}
                                    reviewerLocation={location}
                                    comment={reviewText}
                                    submissionTime={dateCreated}
                                />
                            </li>
                        ))}
                </ul>
            )}
            {!bazaarvoiceSellerReviewsEnabled && reviews.length > numShownReviews && (
                <div data-automation="all-reviews">
                    <Link {...linkProps}>
                        <FormattedMessage {...messages.reviews} />
                        <KeyboardArrowRight
                            viewBox={"0 0 20 20"}
                            className={styles.icon}
                            classes={{
                                root: styles.rightArrowIcon,
                            }}
                        />
                    </Link>
                </div>
            )}
            {!bazaarvoiceSellerReviewsEnabled && reviews.length === 0 && (
                <div data-automation="no-reviews">
                    <FormattedMessage {...messages.noReviews} />
                </div>
            )}
        </div>
    );
};

export default SellerReviews;
