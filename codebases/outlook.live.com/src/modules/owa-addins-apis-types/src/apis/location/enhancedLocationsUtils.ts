import type EnhancedLocation from 'owa-service/lib/contract/EnhancedLocation';
import { LocationDetails, LocationIdentifier, LocationType } from '../../index';

export const createLocationDetails = (enhancedLocation: EnhancedLocation): LocationDetails => {
    let details = { locationIdentifier: {} } as LocationDetails;
    details.displayName = enhancedLocation.DisplayName ?? '';
    if (
        enhancedLocation.PostalAddress &&
        enhancedLocation.PostalAddress.LocationSource === 'Resource' &&
        enhancedLocation.PostalAddress.LocationUri
    ) {
        details.emailAddress = enhancedLocation.PostalAddress.LocationUri;
        details.locationIdentifier.id = details.emailAddress;
        details.locationIdentifier.type = LocationType.Room;
    } else {
        details.emailAddress = '';
        details.locationIdentifier.id = details.displayName;
        details.locationIdentifier.type = LocationType.Custom;
    }
    return details;
};

export function isValidLocationIdentifiersArray(identifiers: LocationIdentifier[]): boolean {
    if (!identifiers || identifiers.length <= 0) {
        return false;
    }

    for (const identifier of identifiers) {
        if (identifier.id.trim().length <= 0) {
            return false;
        }
    }

    return true;
}
