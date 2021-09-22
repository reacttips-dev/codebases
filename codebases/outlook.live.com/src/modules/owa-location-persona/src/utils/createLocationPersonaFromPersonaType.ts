import getInitial from 'owa-persona/lib/utils/getInitial';
import getTextBoyColor from 'owa-persona/lib/utils/getTextBoyColor';
import { getLocalizedAddress, getLocationDisplayText } from 'owa-location-display-text';
import { getLocationPostalAddress } from './getLocationPostalAddress';
import { isNullOrWhiteSpace } from 'owa-string-utils';
import type { LocationPersonaControlViewState } from '../data/schema/LocationPersonaControlViewState';
import type LocationPersonaType from 'owa-calendar-scheduling-service/lib/schema/LocationPersonaType';

/**
 * Create location persona from a personaType
 * @param persona: the persona type
 */
export function createLocationPersonaFromPersonaType(
    persona: LocationPersonaType
): LocationPersonaControlViewState {
    if (persona) {
        let postalAddress = getLocationPostalAddress(persona);
        let displayText = getLocationDisplayText(persona.DisplayName, postalAddress);

        if (persona.PersonaTypeString == 'Room') {
            postalAddress.LocationUri = persona.EmailAddress.EmailAddress;
        }

        return {
            personaId: persona.PersonaId?.Id,
            feedbackId: persona.FeedbackId,
            displayName: displayText,
            postalAddress: postalAddress,
            emailAddress: persona.EmailAddress,
            displayAddress: getLocalizedAddress(postalAddress),
            initials: getInitial(displayText),
            textBoyColor: getTextBoyColor(displayText),
            selectionSource: 'LocationWell',
            personaType: isNullOrWhiteSpace(persona.PersonaTypeString)
                ? 'Unknown'
                : persona.PersonaTypeString,
            personaControlId: persona.PersonaId == null ? persona.FeedbackId : persona.PersonaId.Id,
            availability: persona.Availability,
            numberOfAvailableTimeSlots: persona.NumberOfAvailableTimeSlots,
            totalNumberOfTimeSlots: persona.TotalNumberOfTimeSlots,
            isPartialAvailability: persona.IsPartialAvailability,
            capacity: persona.Capacity,
            entityType: persona.EntityType,
            audioDeviceName: persona.AudioDeviceName,
            displayDeviceName: persona.DisplayDeviceName,
            videoDeviceName: persona.VideoDeviceName,
            isWheelChairAccessible: persona.IsWheelChairAccessible,
        };
    }
    return null;
}
