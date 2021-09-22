import * as React from "react";
import {InjectedIntlProps} from "react-intl";
import {utils as adobeLaunch} from "@bbyca/adobe-launch";

import Link from "components/Link";

import * as styles from "./styles.css";
import messages from "./translations/messages";
import {formatPhoneNumber} from "./utils/helper";

export interface InquiryContact {
    firstName: string;
    phone: string;
    email: string;
}

export interface MobileActivationInquiryConfirmationStateProps {
    inquiryContact: InquiryContact;
    storeLocatorUrl: string;
}

export type MobileActivationInquiryConfirmationProps = MobileActivationInquiryConfirmationStateProps &
    InjectedIntlProps;

export const MobileActivationInquiryConfirmation: React.FC<MobileActivationInquiryConfirmationProps> = ({
    intl,
    inquiryContact,
    storeLocatorUrl,
}) => {
    React.useEffect(() => {
        adobeLaunch.pushEventToDataLayer({
            event: "mobile-activation-confirmation",
        });
    }, []);

    return (
        <div className={styles.confirmationContainer}>
            <h1 className={styles.title}>
                {intl.formatMessage(messages.confirmationTitle, {key: inquiryContact.firstName})}.
            </h1>
            <div className={styles.confirmationTextContainer}>
                <span className={styles.description}>
                    {intl.formatMessage(messages.confirmationDescription, {
                        key: formatPhoneNumber(inquiryContact.phone),
                    })}
                </span>
                <Link href={storeLocatorUrl} external extraAttrs={{"data-automation": "store-locator-link"}}>
                    {intl.formatMessage(messages.storeLinkText)}
                </Link>
                <p className={styles.storeHelpText}>
                    {intl.formatMessage(messages.confirmationText, {key: inquiryContact.email})}
                </p>
                <hr className={styles.horizontalDivider} />
                <Link
                    to="category"
                    className={styles.helpLink}
                    params={["best-buy-mobile", "20006"]}
                    extraAttrs={{"data-automation": "help-link"}}
                    chevronType="right">
                    <span property="name">{intl.formatMessage(messages.continueLink)}</span>
                </Link>
            </div>
        </div>
    );
};

export default MobileActivationInquiryConfirmation;
