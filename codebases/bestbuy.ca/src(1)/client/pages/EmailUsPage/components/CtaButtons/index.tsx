import * as React from "react";

import { Button } from "@bbyca/bbyca-components";
import { FormattedMessage } from "react-intl";
import Link from "components/Link";
import * as styles from "./style.css";
import messages from "./translations/messages";

export const CtaButtons = () => (
    <>
        <Button type="submit" className={styles.submitButton}><FormattedMessage {...messages.submitButton} /></Button>
        <Link chevronType="right" className={styles.cancelButton} to={"help"}><FormattedMessage {...messages.cancelButton} /></Link>
    </>
);

export default CtaButtons;
