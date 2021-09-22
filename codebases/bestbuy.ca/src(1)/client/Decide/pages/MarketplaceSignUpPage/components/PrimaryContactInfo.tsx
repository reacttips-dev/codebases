import * as React from "react";
import {FormattedMessage, InjectedIntlProps, injectIntl} from "react-intl";
import {Input, required, isValidEmailFormat, hasPhoneChars} from "@bbyca/bbyca-components";
import messages from "./translations/messages";
import * as styles from "./styles.css";

export const PrimaryContactInfo: React.FC<InjectedIntlProps> = ({intl}) => {
    return (
        <>
            <h3 className={styles.sectionTitle} data-automation="primary-contact-header">
                <FormattedMessage {...messages.primaryContactInfoTitle} />
            </h3>
            <div className={styles.fullName}>
                <Input
                    className={styles.halfinput}
                    label={intl.formatMessage({...messages.marketplaceSignUpFormFieldFirstName})}
                    maxLength={40}
                    errorMsg={intl.formatMessage({...messages.marketplaceSignUpFormFieldFirstNameErrorMsg})}
                    validators={[required]}
                    name="first_name"
                    extraAttrs={{"data-automation": "first_name"}}
                />
                <Input
                    className={styles.halfinput}
                    label={intl.formatMessage({...messages.marketplaceSignUpFormFieldLastName})}
                    maxLength={40}
                    errorMsg={intl.formatMessage({...messages.marketplaceSignUpFormFieldLastNameErrorMsg})}
                    validators={[required]}
                    name="last_name"
                    extraAttrs={{"data-automation": "last_name"}}
                />
            </div>
            <Input
                className={styles.fullinput}
                label={intl.formatMessage({...messages.marketplaceSignUpFormFieldEmail})}
                maxLength={40}
                errorMsg={intl.formatMessage({...messages.marketplaceSignUpFormFieldEmailErrorMsg})}
                validators={[required, isValidEmailFormat]}
                type="email"
                name="email"
                extraAttrs={{"data-automation": "email"}}
            />
            <div data-automation="phone-div">
                <Input
                    className={styles.halfinput}
                    label={intl.formatMessage({...messages.marketplaceSignUpFormFieldPhoneNumber})}
                    maxLength={40}
                    validators={[required, hasPhoneChars]}
                    name="phone"
                    type="tel"
                    formatter={"(###) ### ####"}
                    extraAttrs={{"data-automation": "phone"}}
                    helperTxt={intl.formatMessage({...messages.marketplaceSignUpFormFieldPhoneNumberCountryLabel})}
                    errorMsg={intl.formatMessage({...messages.marketplaceSignUpFormFieldPhoneNumberErrorMsg})}
                />
            </div>
        </>
    );
};

export default injectIntl(PrimaryContactInfo);
