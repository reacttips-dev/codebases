import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';

export default function getCopiedEmailAddresses(
    recipientsToCopy: ReadWriteRecipientViewState[]
): string {
    const SMTP_ROUTING_TYPE = 'SMTP';
    const PRIVATE_DL_ROUTING_TYPE = 'PDL';
    const ONE_OFF_MAILBOX_TYPE = 'OneOff';
    let copyText;
    recipientsToCopy.forEach((recipient, index) => {
        let email = recipient.persona.EmailAddress;
        if (email.RoutingType === SMTP_ROUTING_TYPE) {
            if (email.Name) {
                let nameToUse =
                    email.MailboxType == ONE_OFF_MAILBOX_TYPE
                        ? email.Name
                        : `"${email.Name.replace('"', '\\"')}"`;
                copyText = copyText
                    ? copyText + `${nameToUse} <${email.EmailAddress}>`
                    : `${nameToUse} <${email.EmailAddress}>`;
            } else {
                copyText = copyText ? copyText + email.EmailAddress : email.EmailAddress;
            }
        } else if (email.RoutingType === PRIVATE_DL_ROUTING_TYPE) {
            copyText = copyText ? copyText + email.Name : email.Name;
        } else {
            copyText = copyText
                ? copyText + `${email.Name} [${email.RoutingType}:${email.EmailAddress}]`
                : `${email.Name} [${email.RoutingType}:${email.EmailAddress}]`;
        }

        if (index < recipientsToCopy.length - 1) {
            copyText += ', ';
        }
    });

    return copyText;
}
