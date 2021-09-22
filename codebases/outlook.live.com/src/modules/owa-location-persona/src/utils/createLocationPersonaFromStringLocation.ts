import getInitial from 'owa-persona/lib/utils/getInitial';
import getTextBoyColor from 'owa-persona/lib/utils/getTextBoyColor';
import type PersonaPostalAddress from 'owa-service/lib/contract/PersonaPostalAddress';
import type { LocationPersonaControlViewState } from '../data/schema/LocationPersonaControlViewState';

/**
 * Create a dummy Persona for string locations to show String locations as resolved entity
 * @param locationName: location displayName
 */
export function createLocationPersonaFromStringLocation(
    locationName: string
): LocationPersonaControlViewState {
    let postalAddress = createDefaultPostalAddress();

    return {
        personaId: locationName,
        displayName: locationName,
        postalAddress: postalAddress,
        displayAddress: '',
        initials: getInitial(locationName),
        textBoyColor: getTextBoyColor(locationName),
        selectionSource: 'ExplicitTyping',
        personaType: 'Unknown',
        personaControlId: locationName,
    };
}

/**
 * Creates a default postal address of Type "Home" and location soure "None"
 */
export function createDefaultPostalAddress(): PersonaPostalAddress {
    return {
        Type: 'Business',
        LocationSource: 'None',
    };
}
