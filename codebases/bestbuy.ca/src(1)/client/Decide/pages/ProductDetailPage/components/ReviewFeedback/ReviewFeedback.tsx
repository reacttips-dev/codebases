import * as React from "react";
import {useEffect} from "react";
import {useState} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {ThumbsUp, ThumbsDown} from "@bbyca/bbyca-components";
import {FormattedMessage} from "react-intl";

import LocalStorageProvider from "providers/LocalStorageProvider";

import {productActionCreators, ProductActionCreators} from "../../../../actions";
import * as styles from "./style.css";
import messages from "./translations/messages";
import ReviewFeedbackButton from "./ReviewFeedbackButton";

interface ReviewFeedbackProps {
    totalNegativeFeedbackCount?: number;
    totalPositiveFeedbackCount?: number;
    reviewId: string;
}

interface LocalStorageObject {
    [key: string]: boolean;
}

interface DispatchProps {
    productActions: ProductActionCreators;
}

export const ReviewFeedback: React.FC<ReviewFeedbackProps & DispatchProps> = ({
    totalNegativeFeedbackCount = 0,
    totalPositiveFeedbackCount = 0,
    reviewId,
    productActions,
}) => {
    const [feedbackClicked, setFeedbackClicked] = useState(false);
    const [reportClicked, setReportClicked] = useState(false);

    useEffect(() => {
        const feedbackSubmission: LocalStorageObject = LocalStorageProvider.getItem("feedback_submission");
        const reportedReviews: LocalStorageObject = LocalStorageProvider.getItem("reported_reviews");
        const reviewReportedPreviously: boolean = reportedReviews && reportedReviews.hasOwnProperty(reviewId);
        const reviewSubmittedPreviously: boolean = feedbackSubmission && feedbackSubmission.hasOwnProperty(reviewId);

        setFeedbackClicked(reviewSubmittedPreviously);
        setReportClicked(reviewReportedPreviously);
    }, []);

    const handleFeedbackClick = (feedback) => {
        if (!feedbackClicked) {
            setFeedbackClicked(true);
            productActions.submitReviewsFeedback(reviewId, feedback);
        }
    };

    const handleReportClick = () => {
        if (!reportClicked) {
            setReportClicked(true);
            productActions.submitReportReview(reviewId);
        }
    };

    const reportButton = (
        <div
            role="button"
            className={styles.reportButton}
            data-automation="report-button-container"
            onClick={handleReportClick}>
            <FormattedMessage {...messages.report} />
        </div>
    );

    const reportedText = (
        <p className={styles.reportedText}>
            <FormattedMessage {...messages.reported} />
        </p>
    );

    return (
        <>
            <div data-automation="helpfulness-feedback-container" className={styles.reviewFeedbackContainer}>
                {!feedbackClicked ? (
                    <>
                        <ReviewFeedbackButton
                            icons={<ThumbsUp className={styles.feedbackIcon} />}
                            handleFeedbackClick={() => handleFeedbackClick(true)}
                            totalFeedbackCount={totalPositiveFeedbackCount}
                            textProps={messages.helpful}
                            dataAutomation="helpful-button-container"
                        />
                        <ReviewFeedbackButton
                            icons={<ThumbsDown className={styles.feedbackIcon} />}
                            handleFeedbackClick={() => handleFeedbackClick(false)}
                            totalFeedbackCount={totalNegativeFeedbackCount}
                            textProps={messages.notHelpful}
                            dataAutomation="not-helpful-button-container"
                        />
                    </>
                ) : (
                    <p className={styles.feedbackSubmitted}>
                        <FormattedMessage {...messages.submittedReview} />
                    </p>
                )}
                {reportClicked ? reportedText : reportButton}
            </div>
        </>
    );
};

const mapDispatchToProps = (dispatch) => {
    return {
        productActions: bindActionCreators(productActionCreators, dispatch),
    };
};

export default connect<ReviewFeedbackProps, DispatchProps>(null, mapDispatchToProps)(ReviewFeedback);
