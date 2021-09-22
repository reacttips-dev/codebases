import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import type EnhancedLocation from 'owa-service/lib/contract/EnhancedLocation';
import isRoom from './isRoom';
import getInitial from 'owa-persona/lib/utils/getInitial';
import getTextBoyColor from 'owa-persona/lib/utils/getTextBoyColor';
import { getLocalizedAddress, getLocationDisplayText } from 'owa-location-display-text';
import { isNullOrWhiteSpace } from 'owa-string-utils';
import type { LocationPersonaControlViewState } from '../data/schema/LocationPersonaControlViewState';

/**
 * Create a Persona for enhanced location to show them as resolved entities
 * @param location: the enhanced location
 */
export function createLocationPersonaFromEnhancedLocation(
    location: EnhancedLocation
): LocationPersonaControlViewState {
    if (location?.DisplayName && location.PostalAddress) {
        let displayText = getLocationDisplayText(location.DisplayName, location.PostalAddress);

        let wrappedEmail: EmailAddressWrapper =
            isRoom(location.PostalAddress) &&
            !isNullOrWhiteSpace(location.PostalAddress.LocationUri)
                ? {
                      EmailAddress: location.PostalAddress.LocationUri,
                  }
                : null;

        return {
            personaId: location.Id,
            displayName: location.DisplayName,
            postalAddress: location.PostalAddress,
            emailAddress: wrappedEmail,
            displayAddress: getLocalizedAddress(location.PostalAddress),
            initials: getInitial(displayText),
            textBoyColor: getTextBoyColor(displayText),
            personaType: isRoom(location.PostalAddress) ? 'Room' : 'Unknown',
            personaControlId: location.DisplayName,
        };
    }
    return null;
}
