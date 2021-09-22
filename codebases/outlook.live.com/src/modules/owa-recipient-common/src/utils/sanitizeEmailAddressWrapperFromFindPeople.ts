import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';

const LEGACY_ROUTING_TYPE = 'EX';

export default (emailAddress: EmailAddressWrapper): EmailAddressWrapper => {
    if (
        emailAddress.RoutingType &&
        emailAddress.RoutingType.toUpperCase() === LEGACY_ROUTING_TYPE
    ) {
        return {
            ...emailAddress,
            EmailAddress: emailAddress.OriginalDisplayName,
        } as EmailAddressWrapper;
    }

    return emailAddress;
};
