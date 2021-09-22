import type EnhancedLocation from 'owa-service/lib/contract/EnhancedLocation';
import isRoom from './isRoom';

/**
 *
 * @param location
 * @param otherLocation
 * NOTE: This can be removed when the location well starts to use Enhanced Locations instead of the LocationPersonaControlViewState
 */
export default function areEnhancedLocationsEqual(
    locations: EnhancedLocation[],
    otherLocations: EnhancedLocation[]
): boolean {
    let isOneLocationsArrayNull: boolean =
        (locations == null && otherLocations != null) ||
        (locations != null && otherLocations == null);
    let areBothLocationsNull: boolean = locations == null && otherLocations == null;

    if (isOneLocationsArrayNull) {
        return false;
    } else if (areBothLocationsNull) {
        return true;
    } else if (locations.length == 0 && otherLocations.length == 0) {
        return true;
    } else if (locations.length != otherLocations.length) {
        return false;
    }

    let i = 0;
    let areAllLocationsEqual = true;
    while (i < locations.length) {
        let loc = locations[i];
        let otherLoc = otherLocations[i];
        if (!areLocationsEqual(loc, otherLoc)) {
            return false;
        }

        i++;
    }

    return areAllLocationsEqual;
}

function areLocationsEqual(loc: EnhancedLocation, otherLoc: EnhancedLocation): boolean {
    // if one location is null then return false
    if ((!loc && otherLoc) || (loc && !otherLoc)) {
        return false;
    }

    // Confrence rooms could be added from Addins in this case the id will be the conference room email,
    // whereas a room added from Las can have a GUID as Id if it came from the MRU
    return (
        loc.Id === otherLoc.Id ||
        (isRoom(loc.PostalAddress) &&
            isRoom(otherLoc.PostalAddress) &&
            loc.PostalAddress.LocationUri.toLowerCase() ===
                otherLoc.PostalAddress.LocationUri.toLowerCase())
    );
}

export function containsLocation(
    locations: EnhancedLocation[],
    otherLocation: EnhancedLocation
): boolean {
    return locations && isRoom(otherLocation.PostalAddress)
        ? containsRoomWithEmail(locations, otherLocation.PostalAddress.LocationUri)
        : containsLocationWithId(locations, otherLocation.Id);
}

export function containsRoomWithEmail(
    locations: EnhancedLocation[],
    emailAddress: string
): boolean {
    return !!(
        emailAddress &&
        locations &&
        locations.some(
            location =>
                isRoom(location.PostalAddress) &&
                location.PostalAddress.LocationUri.toLowerCase() === emailAddress.toLowerCase()
        )
    );
}

export function containsLocationWithId(locations: EnhancedLocation[], id: string): boolean {
    return locations && locations.some(location => location.Id === id);
}
