import * as React from "react";
import {InjectedIntlProps} from "react-intl";

import * as styles from "./styles.css";
import messages from "./translations/messages";

const GeekSquadMembershipConfirmation = (props: InjectedIntlProps) => {
    const {intl} = props;
    return (
        <div className={styles.fullHeight}>
            <h1 className={styles.title}>{intl.formatMessage(messages.geekSquadMembershipConfirmationTitle)}</h1>

            <p>{intl.formatMessage(messages.geekSquadMembershipConfirmationDescription)}</p>
        </div>
    );
};
export default GeekSquadMembershipConfirmation;
