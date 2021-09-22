import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import { isValidSmtpAddress, isAddressWithCustomRoutingType } from './isValidRecipientAddress';

/**
 * @param suspectedAddress the input string we think is either an address (either an smtp address, or an address with custom routing)
 */
export default function parseOneOffEmailAddressFromString(
    suspectedAddress: string,
    displayName?: string
): EmailAddressWrapper | null {
    if (isValidSmtpAddress(suspectedAddress)) {
        return {
            MailboxType: 'OneOff',
            RoutingType: 'SMTP',
            EmailAddress: suspectedAddress,
            Name: displayName ? displayName : suspectedAddress,
        };
    } else if (isAddressWithCustomRoutingType(suspectedAddress)) {
        // An address with a custom routing type MUST have at least one colon in it, where the first
        // colon specifies the routing type.
        const [routingType, routingAddress] = suspectedAddress.split(
            ':',
            2 //limit
        );
        return {
            MailboxType: 'OneOff',
            RoutingType: routingType.toUpperCase(),
            EmailAddress: routingAddress,
            Name: displayName ? displayName : routingAddress,
        };
    }

    // Fallthrough -- we could not parse the suspected address
    return null;
}
