import * as React from "react";
import {SvgIconProps} from "@bbyca/bbyca-components";
import {FormattedMessage} from "react-intl";

import * as styles from "./style.css";

interface ReviewFeedbackButtonProps {
    icons: React.ReactElement<SvgIconProps>;
    handleFeedbackClick: () => void;
    dataAutomation: string;
    totalFeedbackCount?: number;
    textProps: FormattedMessage.MessageDescriptor;
}

const ReviewFeedbackButton: React.FC<ReviewFeedbackButtonProps> = ({
    icons,
    handleFeedbackClick,
    textProps,
    dataAutomation,
    totalFeedbackCount,
}) => {
    return (
        <div
            role="button"
            data-automation={dataAutomation}
            className={styles.reviewFeedbackInnerContainer}
            onClick={handleFeedbackClick}>
            {icons}
            <p className={styles.feedbackCount}>
                <FormattedMessage {...textProps} values={{count: totalFeedbackCount}} />
            </p>
        </div>
    );
};
ReviewFeedbackButton.displayName = "ReviewFeedbackButton";

export default ReviewFeedbackButton;
