import * as Moment from "moment";
import * as React from "react";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { FormattedMessage } from "react-intl";
import Divider from "@material-ui/core/Divider";

import StarRate from "components/StarRate";
import decodeString from "utils/decodeString";

import messages from "./translations/messages";
import * as styles from "./style.css";

interface Props {
    key: number;
    rating: number;
    reviewerName: string;
    reviewerLocation: string;
    submissionTime: string;
    comment: string;
    hideDivider?: boolean;
}

interface CommentProps {
    comment: string;
}

const FeedbackComment = (props: CommentProps) => (
    <div itemProp="reviewBody" className={styles.reviewContent}>
        <p>{decodeString(props.comment)}</p>
    </div>
);

export const SellerFeedbackItem = (props: Props & InjectedIntlProps) => {

    return (
            <li itemScope itemType="http://schema.org/Review" className={styles.review}>
                <meta itemProp="itemReviewed" itemScope itemType="http://schema.org/Organization" />
                <div className={styles.reviewItem}>
                    <div
                        itemProp="reviewRating"
                        itemScope
                        itemType="http://schema.org/Rating"
                        className={styles.ratingBlock}>
                        <meta itemProp="ratingValue" content={props.rating.toString()} />
                        <StarRate rate={props.rating} />
                    </div>
                    <FeedbackComment comment={props.comment} />
                    <div className={styles.author}>
                        <FormattedMessage {...messages.fullname} values={{
                            name:
                            <span itemProp="author" itemScope itemType="http://schema.org/Person">
                                <span className={styles.authorName} itemProp="name">
                                    {decodeString(props.reviewerName)}
                                </span>
                            </span>,
                        }} />
                    </div>
                    <p className={styles.locationAndTime}>
                        <FormattedMessage {...messages.locationDate} values={{
                            city: props.reviewerLocation,
                            date: Moment(props.submissionTime).format("LL"),
                        }} />
                    </p>
                </div>
                {props.hideDivider ? "" : <Divider className={styles.divider} />}
            </li>
    );
};

export default injectIntl<Props>(SellerFeedbackItem);
