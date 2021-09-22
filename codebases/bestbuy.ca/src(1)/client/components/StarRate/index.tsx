import * as React from "react";
import {FormattedPlural, FormattedMessage} from "react-intl";
import * as styles from "./style.css";
import FeedbackStar from "./FeedbackStar";
import messages from "./translations/messages";

interface StarRateProps {
    rate: number | string;
    count?: number;
    hideRatingScore?: boolean;
    hideRatingScoreAndReviewCount?: boolean;
    disableSeoAttributes?: boolean;
    size?: string;
    onClickHandler?: (ratingIndex: number) => (e: React.MouseEvent) => void;
    onClickRatingsHandler?: () => void;
}

/**
 * Render the rate given to a product as yellow stars.
 *
 * props.rate: number 0 - 5
 * props.count: number of users who rated
 * If rate is bigger than 5 the component will always render 5 stars.
 *
 */

const StarRate = (props: StarRateProps) => {
    // Calculating rate here since there are cases or data flaws which could have a
    // review count equal to zero but a rating score of more than zero
    const rate: any = props.count === undefined || props.count > 0 ? props.rate : 0;
    // Round it to first decimal to display rating value
    const nearestDecimalRating = (Math.round(parseFloat((rate || 0).toString()) * 10) / 10).toFixed(1);
    const reviewsCount = props.count || 0;
    // Range 0-5 out of 5
    const MAXIMUM_START_RATE = 5;
    const starTypes: React.ReactChild[] = [];

    let fullStarRating: number = 0;
    let fractionStarRating: number = 0;

    if (typeof rate === "string") {
        fullStarRating = parseInt(rate, 10);
        fractionStarRating = parseFloat(rate) % 1;
    } else {
        fullStarRating = Math.floor(rate);
        fractionStarRating = rate % 1;
    }

    const renderStars = () => {
        for (let i: number = 0; i < MAXIMUM_START_RATE; i++) {
            const star = (
                <FeedbackStar
                    key={i}
                    value={rate - i}
                    size={props.size}
                    onClickHandler={props.onClickHandler && props.onClickHandler(i)}
                />
            );
            starTypes.push(star);
        }

        return starTypes;
    };

    const reviewsCountMessage = (
        <FormattedMessage
            {...messages.reviewsCount}
            values={{
                count: reviewsCount,
            }}
        />
    );

    const oneReviewCountMessage = (
        <FormattedMessage
            {...messages.oneReviewCount}
            values={{
                count: reviewsCount,
            }}
        />
    );

    const reviewCountElement = (
        <FormattedPlural value={reviewsCount} one={oneReviewCountMessage} other={reviewsCountMessage} />
    );

    const getStarRatingAndCount = () => {
        const {onClickRatingsHandler, count, hideRatingScore, hideRatingScoreAndReviewCount} = props;
        if (typeof count !== "number" || (onClickRatingsHandler && count === 0) || hideRatingScoreAndReviewCount) {
            return;
        }

        const itemProps = {
            container: props.disableSeoAttributes
                ? {}
                : {itemProp: "aggregateRating", itemScope: true, itemType: "http://schema.org/AggregateRating"},
            metaRatingValue: <meta itemProp="ratingValue" content={rate.toString()} />,
            metaReviewCount: <meta itemProp="reviewCount" content={reviewsCount.toString()} />,
        };

        return (
            <div className={styles.reviews}>
                {!hideRatingScore && (
                    <label className={styles.ratings}>
                        <strong>{nearestDecimalRating}</strong>
                    </label>
                )}
                <span className={styles.reviewCountContainer} {...itemProps.container}>
                    {!props.disableSeoAttributes && itemProps.metaRatingValue}
                    {!props.disableSeoAttributes && itemProps.metaReviewCount}
                    <span data-automation="rating-count">
                        {typeof onClickRatingsHandler === "function" ? (
                            <button className={styles.ratingLink} id="rating-link" data-automation="rating-link">
                                {reviewCountElement}
                            </button>
                        ) : (
                            reviewCountElement
                        )}
                    </span>
                </span>
            </div>
        );
    };

    return (
        <div className={styles.starRateContainer} role="button" onClick={props.onClickRatingsHandler}>
            <div className={styles.feedbackStarContainer}>{renderStars()}</div>
            {getStarRatingAndCount()}
        </div>
    );
};

export default StarRate;
