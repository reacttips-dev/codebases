import type EnhancedLocation from 'owa-service/lib/contract/EnhancedLocation';
import type { LocationPersonaControlViewState } from '../data/schema/LocationPersonaControlViewState';

/**
 * This function accept LocationPersonaControlViewState and returns new EnhancedLocation object
 * @param locationPersonaControlViewState - loctopm Persona control view state object
 */
export default function createEnhancedLocationsFromPersonaControlViewState(
    locationPersonaControlViewState: string | LocationPersonaControlViewState
): EnhancedLocation[] {
    let enhancedLocations: EnhancedLocation[] = [];
    if (locationPersonaControlViewState) {
        if (typeof locationPersonaControlViewState != 'string') {
            enhancedLocations.push({
                Id: locationPersonaControlViewState.personaId,
                DisplayName: locationPersonaControlViewState.displayName,
                PostalAddress: locationPersonaControlViewState.postalAddress,
            } as EnhancedLocation);
        }
    }
    return enhancedLocations;
}
