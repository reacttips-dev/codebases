import type PersonaType from 'owa-service/lib/contract/PersonaType';
import type PostalAddress from 'owa-service/lib/contract/PersonaPostalAddress';

/**
 * Gets the postalAddress from the location persona type. The default postal address is
 * the home address if present, otherwise the business address if present, otherwise
 * other address or null if no postal address is specified
 * @param persona: the location persona type
 */
export function getLocationPostalAddress(persona: PersonaType): PostalAddress {
    if (!persona) {
        return null;
    }

    if (persona.HomeAddressesArray != null && persona.HomeAddressesArray.length > 0) {
        return persona.HomeAddressesArray[0].Value;
    } else if (
        persona.BusinessAddressesArray != null &&
        persona.BusinessAddressesArray.length > 0
    ) {
        return persona.BusinessAddressesArray[0].Value;
    } else if (persona.OtherAddressesArray != null && persona.OtherAddressesArray.length > 0) {
        return persona.OtherAddressesArray[0].Value;
    } else {
        return null;
    }
}
