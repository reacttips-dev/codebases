import * as React from "react";
import { FormattedMessage } from "react-intl";

import * as styles from "./style.css";
import messages from "./translations/messages";

const ReviewGuidelines = () => {
    return (
        <div className={styles.reviewGuidelines} data-automation="reviewGuidelines">
            <h4><FormattedMessage {...messages.doTitle} /></h4>
            <ul>
                <li><FormattedMessage {...messages.do1} /></li>
                <li><FormattedMessage {...messages.do2} /></li>
            </ul>
            <h4><FormattedMessage {...messages.dontTitle} /></h4>
            <ul>
                <li><FormattedMessage {...messages.dont1} /></li>
                <li><FormattedMessage {...messages.dont2} /></li>
                <li><FormattedMessage {...messages.dont3} /></li>
            </ul>
        </div>
    );
};

export default ReviewGuidelines;
