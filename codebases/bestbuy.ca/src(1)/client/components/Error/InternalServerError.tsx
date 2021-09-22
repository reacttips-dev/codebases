import * as React from "react";
import {FormattedMessage} from "react-intl";
import * as Timestamp from "react-timestamp";
import * as styles from "./style.css";
import messages from "./translations/messages";

export const InternalServerError = () => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <FormattedMessage {...messages.internalServerErrorHeader} />
            </div>
            <div className={styles.subheader}>
                <FormattedMessage {...messages.internalServerErrorSubheader} />
            </div>
            <a href="/" className={styles.homepageButton}>
                <FormattedMessage {...messages.internalServerErrorHomepageButton} />
            </a>
            <div className={styles.timestamp}>
                <Timestamp format="full" />
            </div>
        </div>
    );
};

export default InternalServerError;
