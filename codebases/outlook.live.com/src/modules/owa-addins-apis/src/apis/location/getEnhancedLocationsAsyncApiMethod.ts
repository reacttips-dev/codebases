import type EnhancedLocation from 'owa-service/lib/contract/EnhancedLocation';
import type { ApiMethodCallback } from '../ApiMethod';
import { createLocationDetails, LocationDetails } from 'owa-addins-apis-types';
import { createSuccessResult } from '../ApiMethodResponseCreator';
import { getAdapter, CommonAdapter } from 'owa-addins-adapters';

export default function getEnhancedLocationsAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: null,
    callback: ApiMethodCallback
) {
    const adapter = getAdapter(hostItemIndex) as CommonAdapter;
    const enhancedLocations: EnhancedLocation[] = adapter.getEnhancedLocations();

    if (!enhancedLocations || enhancedLocations.length <= 0) {
        callback(createSuccessResult([]));
        return;
    }
    const locationDetails: LocationDetails[] = enhancedLocations.map(createLocationDetails);
    callback(createSuccessResult(locationDetails));
}
