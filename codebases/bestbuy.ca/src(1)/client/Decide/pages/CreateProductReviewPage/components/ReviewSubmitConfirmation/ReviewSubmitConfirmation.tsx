import * as React from "react";
import {FormattedMessage} from "react-intl";
import {Key} from "@bbyca/apex-components";
import * as styles from "./styles.css";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";

import Link from "components/Link";

import messages from "./translations/messages";

interface ReviewSubmitConfirmationProps {
    bazaarVoiceEnabled?: boolean;
}

const ReviewSubmitConfirmation = (props: ReviewSubmitConfirmationProps) => {
    const legacyConfirmation = (
        <div className={styles.reviewSubmitConfirmationContainer} data-automation="legacy-confirmation">
            <h2 className={styles.thanksHeadline}>
                <FormattedMessage {...messages.headline} />
            </h2>
            <p>
                <FormattedMessage {...messages.legacyParagraph} />
            </p>
            <Link
                extraAttrs={{"data-automation": "continue-shopping"}}
                className={styles.startShoppingLink}
                to={"homepage" as Key}>
                <FormattedMessage {...messages.startShoppingLink} />
                <KeyboardArrowRight className={styles.rightArrowIcon} />
            </Link>
        </div>
    );

    const submitConfirmation = (
        <div className={styles.reviewSubmitConfirmationContainer} data-automation="review-confirmation">
            <h2 className={styles.thanksHeadline}>
                <FormattedMessage {...messages.headline} />
            </h2>
            <p>
                <FormattedMessage {...messages.paragraph} />
            </p>
        </div>
    );

    return props.bazaarVoiceEnabled ? submitConfirmation : legacyConfirmation;
};

export default ReviewSubmitConfirmation;
