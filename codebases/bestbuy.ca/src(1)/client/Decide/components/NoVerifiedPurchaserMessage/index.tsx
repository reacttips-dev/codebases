import * as React from "react";
import {FormattedMessage} from "react-intl";

import {classname} from "utils/classname";

import * as styles from "./style.css";
import messages from "./translations/messages";

export interface NoVerifiedPurchaserMessageProps {
    className: string;
}

export const NoVerifiedPurchaserMessage: React.FC<NoVerifiedPurchaserMessageProps> = ({className}) => {
    return (
        <p className={classname([styles.noVerifiedPurchaserReviewsContainer, className])}>
            <FormattedMessage {...messages.noVerifiedPurchaserMessage} />
        </p>
    );
};
