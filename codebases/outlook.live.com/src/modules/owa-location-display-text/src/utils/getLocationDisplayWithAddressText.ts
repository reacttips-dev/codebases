import { format } from 'owa-localize';
import type PersonaPostalAddress from 'owa-service/lib/contract/PersonaPostalAddress';

import { getLocalizedAddress } from './getLocalizedAddress';
import { isNullOrWhiteSpace } from 'owa-string-utils';

/**
 * Gets the Location display text from the location persona.
 * It is the display name of the location if present, the a localized postal address otherwise
 * @param postalAddress: the location persona
 * @param displayName: the location displayName
 * @param preferDisplayname: if there is a display name, only show that
 */
export function getLocationDisplayWithAddressText(
    displayName: string,
    postalAddress: PersonaPostalAddress,
    preferDisplayName?: boolean
): string {
    const postalAddressText = getLocalizedAddress(postalAddress);
    return isNullOrWhiteSpace(displayName)
        ? postalAddressText
        : postalAddressText == '' || preferDisplayName
        ? displayName
        : format('{0} ({1})', displayName, postalAddressText);
}
