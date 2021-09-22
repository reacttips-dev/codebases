import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';

/**
 * Creates a fake SMTP email address without validating the string.
 *
 * Please don't call this unless you know what you're doing.
 */
export default function dangerousCreateSMTPEmailAddressWithoutValidation(
    address: string,
    displayName?: string
): EmailAddressWrapper {
    return {
        MailboxType: 'OneOff',
        RoutingType: 'SMTP',
        EmailAddress: address,
        Name: displayName || address,
    };
}
