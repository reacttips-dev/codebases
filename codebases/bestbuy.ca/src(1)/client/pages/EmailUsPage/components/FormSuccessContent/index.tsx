import * as React from "react";
import { SuccessConfirmation, SuccessTitle, SuccessBody } from "@bbyca/bbyca-components";
import Link from "components/Link";
import messages from "./translations/messages";
import * as styles from "./style.css";
import { FormattedMessage } from "react-intl";

export const FormSuccessContent = () => (
    <SuccessConfirmation>
        <SuccessTitle className={styles.success}>
            <FormattedMessage {...messages.success} />
        </SuccessTitle>
        <h2 className={styles.messageSent}>
            <FormattedMessage {...messages.messageSent} />
        </h2>
        <SuccessBody className={styles.successBody}>
            <FormattedMessage {...messages.thankYou} />
        </SuccessBody>
        <Link
            className={styles.keepBrowsing}
            chevronType="right"
            to={"homepage"}>
            <FormattedMessage {...messages.keepBrowsing} />
        </Link>
    </SuccessConfirmation>
);

export default FormSuccessContent;
