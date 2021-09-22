import * as Moment from "moment";
import * as React from "react";
import {FormattedMessage} from "react-intl";
import {State} from "store";
import {connect} from "react-redux";
import {isEmpty} from "lodash-es";
import {IBrowser as ScreenSize} from "redux-responsive/types";
import {NotRecommended, Recommended, Verified, Row, Col} from "@bbyca/bbyca-components";

import StarRate from "components/StarRate";
import {classname} from "utils/classname";
import decodeString from "utils/decodeString";
import {SyndicationSource, KeyConsiderations} from "models";

import * as styles from "./style.css";
import messages from "./translations/messages";
import {ReviewFeedback} from "../ReviewFeedback";
import {isSyndicated} from "../../utils";
import {AttributeGroup} from "Decide/components/KeyConsiderations";
import { getScreenSize } from "store/selectors";

export interface StateProps {
    screenSize: ScreenSize;
}
export interface CustomerReviewItemProps {
    isRecommended?: boolean | null;
    title: string;
    rating: number;
    reviewerName: string;
    reviewerLocation: string;
    submissionTime: string;
    syndicationSource?: SyndicationSource;
    comment: string;
    productName?: string;
    reviewId?: string;
    totalNegativeFeedbackCount?: number;
    totalPositiveFeedbackCount?: number;
    isVerifiedPurchaser: boolean;
    disableSeoAttributes?: boolean;
    keyConsiderations: KeyConsiderations;
}

interface CommentProps {
    comment: string;
    reviewBodySeoProps?: {
        itemProp: string;
    };
}

const ReviewComment: React.FC<CommentProps> = ({comment, reviewBodySeoProps}) => (
    <div className={styles.reviewContent} {...reviewBodySeoProps}>
        <p>{decodeString(comment)}</p>
    </div>
);

export const CustomerReviewItem = (props: CustomerReviewItemProps & StateProps & React.HTMLAttributes<HTMLDivElement>) => {
    const {
        reviewId,
        totalNegativeFeedbackCount,
        totalPositiveFeedbackCount,
        syndicationSource,
        rating,
        comment,
        isRecommended,
        title,
        reviewerName,
        isVerifiedPurchaser,
        disableSeoAttributes,
        keyConsiderations,
        screenSize,
    } = props;

    // render SEO for non-syndicated reviews (1st party)
    const seoProps = !disableSeoAttributes &&
        !isSyndicated(syndicationSource) && {
            rating: {
                itemScope: true,
                itemProp: "reviewRating",
                itemType: "http://schema.org/Rating",
            },
            author: {
                itemScope: true,
                itemProp: "author",
                itemType: "http://schema.org/Person",
            },
            authorName: {
                itemProp: "name",
            },
            reviewBodySeoProps: {
                itemProp: "reviewBody",
            },
            ratingValue: {
                itemProp: "ratingValue",
                content: rating.toString(),
            },
            reviewContainer: {
                itemProp: "Review",
                itemScope: true,
                itemType: "https://schema.org/Review",
            },
        };

    const friendRecommendation =
        isRecommended === null || isRecommended === undefined ? null : (
            <>
                <div className={styles.recommendedIconsContainer}>
                    {isRecommended ? (
                        <Recommended className={styles.recommendedIcons} color={"black"} />
                    ) : (
                        <NotRecommended className={styles.recommendedIcons} color={"black"} />
                    )}
                </div>
                <div className={styles.friendRecommendationTextContainer}>
                    <span className={styles.friendRecommendationOption}>
                        {isRecommended ? (
                            <FormattedMessage {...messages.friendRecommendationOptionYes} />
                        ) : (
                            <FormattedMessage {...messages.friendRecommendationOptionNo} />
                        )}
                    </span>
                    <span>
                        {isRecommended ? (
                            <FormattedMessage {...messages.friendRecommendationOptionYesText} />
                        ) : (
                            <FormattedMessage {...messages.friendRecommendationOptionNoText} />
                        )}
                    </span>
                </div>
            </>
        );

    const verifiedPurchaserSection = (
        <span className={styles.isVerifiedPurchaser}>
            <Verified className={styles.isVerifiedPurchaserIcon} />
            <FormattedMessage {...messages.verifiedPurchaser} />
        </span>
    );

    return (
        <li
            className={styles.review}
            key={reviewId}
            data-automation="review-list-item"
            {...(seoProps && seoProps.reviewContainer)}>
            <Row className={styles.reviewItem}>
                <Col sm={6} md={8} className={styles.col}>
                    <div
                        className={styles.ratingBlock}
                        data-automation="star-rating-wrapper"
                        {...(seoProps && seoProps.rating)}>
                        {!isSyndicated(syndicationSource) && (
                            <meta {...(seoProps && seoProps.ratingValue)} data-automation="star-rating-meta" />
                        )}
                        <StarRate rate={rating} hideRatingScoreAndReviewCount={true} />
                    </div>
                    <div className={styles.reviewTitle}>{decodeString(title)}</div>
                    {!title && (
                        <ReviewComment comment={comment} reviewBodySeoProps={seoProps && seoProps.reviewBodySeoProps} />
                    )}
                    <div className={styles.reviewerInfo}>
                        <span className={styles.author}>
                            {isVerifiedPurchaser ? verifiedPurchaserSection : null}
                            <FormattedMessage
                                {...messages.reviewedBy}
                                values={{
                                    name: (
                                        <span {...(seoProps && seoProps.author)}>
                                            <span className={styles.authorName} {...(seoProps && seoProps.authorName)}>
                                                {decodeString(reviewerName)}
                                            </span>
                                        </span>
                                    ),
                                }}
                            />
                        </span>
                        &nbsp;
                        <span
                            className={styles.locationAndTime}
                            data-automation="rating-date"
                            data-date={props.submissionTime}>
                            <FormattedMessage
                                {...messages.date}
                                values={{
                                    date: Moment(props.submissionTime).format("LL"),
                                }}
                            />
                        </span>
                    </div>
                    {props.title && (
                        <ReviewComment comment={comment} reviewBodySeoProps={seoProps && seoProps.reviewBodySeoProps} />
                    )}
                    {screenSize.is.extraSmall && !isEmpty(keyConsiderations) && (
                        <AttributeGroup
                            className={styles.attributeGroup}
                            quality={keyConsiderations.quality}
                            value={keyConsiderations.value}
                            easeOfUse={keyConsiderations.easeOfUse}
                        />
                    )}
                    {isSyndicated(syndicationSource) && (
                        <p className={styles.syndicationSource}>
                            <FormattedMessage
                                {...messages.syndicationSource}
                                values={{
                                    sourceName: syndicationSource.name,
                                }}
                            />
                        </p>
                    )}
                    {friendRecommendation}
                    {!isSyndicated(syndicationSource) && reviewId && (
                        <ReviewFeedback
                        totalNegativeFeedbackCount={totalNegativeFeedbackCount}
                        totalPositiveFeedbackCount={totalPositiveFeedbackCount}
                        reviewId={reviewId}
                        />
                    )}
                </Col>
                {screenSize.greaterThan.extraSmall && !isEmpty(keyConsiderations) && (
                    <Col sm={5} smOffset={1} md={3} className={classname([styles.col, styles.rightColumn])}>
                        <AttributeGroup
                            quality={keyConsiderations.quality}
                            value={keyConsiderations.value}
                            easeOfUse={keyConsiderations.easeOfUse}
                        />
                    </Col>
                )}
            </Row>
            <hr className={styles.reviewItemDivider} />
        </li>
    );
};

CustomerReviewItem.displayName = "CustomerReviewItem";

const mapStateToProps = (state: State) => {
    return {
        screenSize: getScreenSize(state),
    };
};

export default connect<StateProps>(
    mapStateToProps,
)(CustomerReviewItem);
