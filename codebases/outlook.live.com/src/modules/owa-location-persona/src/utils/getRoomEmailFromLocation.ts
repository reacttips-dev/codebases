import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import type EnhancedLocation from 'owa-service/lib/contract/EnhancedLocation';

export function getRoomEmailFromLocation(location: EnhancedLocation): EmailAddressWrapper {
    return {
        EmailAddress: location.PostalAddress.LocationUri,
        Name: location.DisplayName,
    } as EmailAddressWrapper;
}
