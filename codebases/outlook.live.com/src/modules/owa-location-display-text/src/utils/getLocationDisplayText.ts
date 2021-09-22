import type PersonaPostalAddress from 'owa-service/lib/contract/PersonaPostalAddress';
import { getLocalizedAddress } from './getLocalizedAddress';
import { isNullOrWhiteSpace } from 'owa-string-utils';

/**
 * Gets the Location display text from the location persona.
 * It is the display name of the location if present, the a localized postal address otherwise
 * @param postalAddress: the location persona
 * @param displayName: the location displayName
 */
export function getLocationDisplayText(
    displayName: string,
    postalAddress: PersonaPostalAddress
): string {
    return isNullOrWhiteSpace(displayName) ? getLocalizedAddress(postalAddress) : displayName;
}
