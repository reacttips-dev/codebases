import type { ApiMethodCallback } from '../ApiMethod';
import { createErrorResult, createSuccessResult } from '../ApiMethodResponseCreator';
import { getAdapter, AppointmentComposeAdapter } from 'owa-addins-adapters';
import {
    isValidLocationIdentifiersArray,
    AddRemoveEnhancedLocationsArgs,
} from 'owa-addins-apis-types';

export default function removeEnhancedLocationsAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: AddRemoveEnhancedLocationsArgs,
    callback: ApiMethodCallback
) {
    const adapter = getAdapter(hostItemIndex) as AppointmentComposeAdapter;
    if (!data || !isValidLocationIdentifiersArray(data.enhancedLocations)) {
        callback(createErrorResult());
        return;
    }
    adapter.removeEnhancedLocations(data.enhancedLocations);
    callback(createSuccessResult());
}
