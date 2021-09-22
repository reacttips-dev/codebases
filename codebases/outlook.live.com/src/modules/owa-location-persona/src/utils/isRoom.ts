import isEnhancedLocation from './isEnhancedLocation';
import type PersonaPostalAddress from 'owa-service/lib/contract/PersonaPostalAddress';

export default function isRoom(postalAddress: PersonaPostalAddress): boolean {
    return isEnhancedLocation(postalAddress) && postalAddress.LocationSource === 'Resource';
}
