import * as React from "react";
import { injectIntl, InjectedIntlProps } from "react-intl";

import * as styles from "./styles.css";
import messages from "./translations/messages";

export const MarketplaceSignUpConfirmation: React.SFC<InjectedIntlProps> = ({
    intl,
}) => (
        <div className={styles.fullHeight} data-automation="confirmation-div">
            <h1 className={styles.title}>{intl.formatMessage({ ...messages.marketplaceConfirmationTitle })}</h1>

            <p>{intl.formatMessage({ ...messages.marketplaceConfirmationDescription })}</p>
        </div>
    );

export default injectIntl(MarketplaceSignUpConfirmation);
