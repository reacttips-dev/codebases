import {
    isValidLocationIdentifiersArray,
    AddRemoveEnhancedLocationsArgs,
} from 'owa-addins-apis-types';
import { getAdapter, AppointmentComposeAdapter } from 'owa-addins-adapters';
import type { ApiMethodCallback } from '../ApiMethod';
import { createErrorResult, createSuccessResult } from '../ApiMethodResponseCreator';
import { returnErrorIfUserCannotEditItem } from '../sharedProperties/itemPermissions';

export default async function addEnhancedLocationsAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: AddRemoveEnhancedLocationsArgs,
    callback: ApiMethodCallback
) {
    const adapter = getAdapter(hostItemIndex) as AppointmentComposeAdapter;

    if (returnErrorIfUserCannotEditItem(adapter, callback)) {
        return;
    }

    if (!data || !isValidLocationIdentifiersArray(data.enhancedLocations)) {
        callback(createErrorResult());
        return;
    }
    try {
        await adapter.addEnhancedLocations(data.enhancedLocations);
        callback(createSuccessResult());
    } catch (e) {
        callback(createErrorResult());
    }
}
