import * as React from "react";
import {FormattedMessage, injectIntl} from "react-intl";
import * as styles from "./styles.css";

import messages from "./translations/messages";

export const SellerOnboardingHeader = () => {
    return (
        <>
            <h1 className={styles.headerTitle} data-automation="form-header">
                <b>
                    <FormattedMessage {...messages.sellerOnboardingHeaderTitle} />
                </b>
            </h1>
            <p className={styles.headerContent} data-automation="form-header-content">
                <FormattedMessage {...messages.sellerOnboardingHeaderContent} />
            </p>
            <p className={styles.headerHelper} data-automation="form-header-helper-txt">
                <FormattedMessage {...messages.sellerOnboardingHeaderRequiredInfo} />
            </p>
        </>
    );
};

export default injectIntl(SellerOnboardingHeader);
