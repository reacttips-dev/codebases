import * as React from "react";
import {InjectedIntlProps} from "react-intl";

import messages from "./translations/messages";
import * as styles from "./styles.css";

const InHomeConsultationSignUpConfirmation = (props: InjectedIntlProps) => {
    const {intl} = props;
    return (
        <div className={styles.fullHeight}>
            <h1 className={styles.title}>{intl.formatMessage(messages.inHomeConsultationConfirmationTitle)}</h1>

            <p>{intl.formatMessage(messages.inHomeConsultationConfirmationDescription)}</p>
        </div>
    );
};
export default InHomeConsultationSignUpConfirmation;
