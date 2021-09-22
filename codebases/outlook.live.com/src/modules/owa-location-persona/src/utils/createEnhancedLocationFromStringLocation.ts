import type EnhancedLocation from 'owa-service/lib/contract/EnhancedLocation';
import { createDefaultPostalAddress } from './createLocationPersonaFromStringLocation';
/**
 * Creates an enhanced location from a string location
 */
export function createEnhancedLocationFromStringLocation(location: string): EnhancedLocation {
    return {
        Id: location,
        DisplayName: location,
        PostalAddress: createDefaultPostalAddress(),
    } as EnhancedLocation;
}
