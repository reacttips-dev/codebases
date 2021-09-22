import isConsumer from 'owa-session-store/lib/utils/isConsumer';

const ONEOFF_MAILBOX_TYPE = 'OneOff';
const UNKNOWN_MAILBOX_TYPE = 'Unknown';

export default function isShowFullEmailForEnterprise(
    name?: string,
    emailAddress?: string,
    mailboxType?: string
): boolean {
    // If the email address is an external email address, shows the full SMTP email address.
    // If the display name already contains email address in the value, don't need to shows both of them.
    return (
        !isConsumer() &&
        (mailboxType == ONEOFF_MAILBOX_TYPE || mailboxType == UNKNOWN_MAILBOX_TYPE) &&
        name?.indexOf(emailAddress) < 0
    );
}
