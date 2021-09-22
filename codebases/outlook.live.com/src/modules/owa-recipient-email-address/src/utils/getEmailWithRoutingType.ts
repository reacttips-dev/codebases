import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';

export default function getEmailWithRoutingType(email: EmailAddressWrapper): string {
    if (email.RoutingType === 'SMTP' || email.RoutingType === undefined) {
        return email.EmailAddress;
    }

    const addressPart =
        email.RoutingType === 'MAPIPDL'
            ? email.ItemId?.Id || email.EmailAddress
            : email.EmailAddress;

    // For non-smtp recipients, give the full routing address.
    return `${email.RoutingType}:${addressPart}`;
}
