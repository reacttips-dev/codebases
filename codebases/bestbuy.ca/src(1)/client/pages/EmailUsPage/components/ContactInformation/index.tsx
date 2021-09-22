import * as React from "react";
import { Input, required, isValidEmailFormat } from "@bbyca/bbyca-components";
import * as styles from "./style.css";

import messages from "./translations/messages";
import { FormattedMessage, injectIntl, InjectedIntlProps } from "react-intl";

export const ContactInformation = (props: InjectedIntlProps) => {
    return (
        <div className={styles.contactInfo}>
            <h3><FormattedMessage {...messages.contactInfo} /></h3>
            <Input
                className={`${styles.nameField} ${styles.firstName}`}
                name="firstName"
                validators={[required]}
                label={props.intl.formatMessage(messages.firstName)}
                errorMsg={props.intl.formatMessage(messages.firstNameError)}
                maxLength={40}
            />
            <Input
                className={styles.nameField}
                name="lastName"
                validators={[required]}
                label={props.intl.formatMessage(messages.lastName)}
                errorMsg={props.intl.formatMessage(messages.lastNameError)}
                maxLength={40}
            />
            <Input
                name="email"
                validators={[required, isValidEmailFormat]}
                label={props.intl.formatMessage(messages.emailAddress)}
                errorMsg={props.intl.formatMessage(messages.emailAddressError)}
                maxLength={100}
            />
        </div>
    );
};

export default injectIntl(ContactInformation);
