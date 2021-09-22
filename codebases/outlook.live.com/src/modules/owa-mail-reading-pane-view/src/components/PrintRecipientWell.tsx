import convertRecipientsToViewState from 'owa-recipient-create-viewstate/lib/util/convertRecipientsToViewState';
import ReadOnlyPrintRecipientWell from 'owa-readonly-recipient-well/lib/components/ReadOnlyPrintRecipientWell';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import * as React from 'react';

import styles from './PrintPanel.scss';

export interface PrintRecipientWellProps {
    toRecipients: EmailAddressWrapper[];
    ccRecipients: EmailAddressWrapper[];
    bccRecipients: EmailAddressWrapper[];
}

const PrintRecipientWell = (props: PrintRecipientWellProps) => {
    const convertedToRecipients = convertRecipientsToViewState(
        props.toRecipients,
        true /* alwaysShowFullEmail */
    );
    const convertedCcRecipients = convertRecipientsToViewState(
        props.ccRecipients,
        true /* alwaysShowFullEmail */
    );
    const convertedBccRecipients = convertRecipientsToViewState(
        props.bccRecipients,
        true /* alwaysShowFullEmail */
    );

    return (
        <div className={styles.printRecipientWell}>
            <ReadOnlyPrintRecipientWell
                toRecipients={convertedToRecipients}
                ccRecipients={convertedCcRecipients}
                bccRecipients={convertedBccRecipients}
            />
        </div>
    );
};

export default PrintRecipientWell;
